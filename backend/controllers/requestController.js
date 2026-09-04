const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

// @desc    Send a new connection request
// @route   POST /api/requests
// @access  Private (Protected by JWT)
const createRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // Check that receiverId is provided
    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver user ID is required' });
    }

    // Prevent sending connection requests to oneself
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot send a connection request to yourself' });
    }

    // Verify receiver exists in the database
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: 'Target user does not exist' });
    }

    // Check for any pre-existing request in either direction
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        message: `Request already exists. Current status is '${existingRequest.status}'`
      });
    }

    // Create the connection request document
    const request = await ConnectionRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create Connection Request Error:', error.message);
    res.status(500).json({ message: 'Server error sending connection request' });
  }
};

// @desc    Get all incoming and outgoing connection requests for the logged-in user
// @route   GET /api/requests
// @access  Private (Protected by JWT)
const getRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all requests involving the current user, populating profile names/skills/avatars
    const requests = await ConnectionRequest.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate('sender', 'name email avatar bio location teachingSkills learningSkills')
    .populate('receiver', 'name email avatar bio location teachingSkills learningSkills')
    .sort({ createdAt: -1 });

    // Divide requests into categorized segments for easier frontend processing
    const incoming = requests.filter(r => r.receiver._id.toString() === userId.toString());
    const outgoing = requests.filter(r => r.sender._id.toString() === userId.toString());

    res.status(200).json({ incoming, outgoing });
  } catch (error) {
    console.error('Get Requests Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving requests' });
  }
};

// @desc    Accept or reject a pending connection request
// @route   PATCH /api/requests/:id
// @access  Private (Protected by JWT)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // should be 'accepted' or 'rejected'
    const userId = req.user._id;

    // Validate inputs
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Authorization: Only the receiver of the request is allowed to accept/reject it
    if (request.receiver.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to respond to this request' });
    }

    // Prevent modifying requests that have already been responded to
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request has already been ${request.status}` });
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Update Request Error:', error.message);
    res.status(500).json({ message: 'Server error updating request status' });
  }
};

// @desc    Cancel a pending request or delete an existing connection
// @route   DELETE /api/requests/:id
// @access  Private (Protected by JWT)
const deleteRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Authorization Check: Must be either the sender or receiver to cancel/delete
    if (request.sender.toString() !== userId.toString() && request.receiver.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this request' });
    }

    await ConnectionRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete Request Error:', error.message);
    res.status(500).json({ message: 'Server error deleting request' });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest
};
