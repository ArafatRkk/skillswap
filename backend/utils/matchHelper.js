/**
 * Calculates the skill-swapping match score between two users.
 * 
 * Score calculation:
 * - 2 (Strong Match): User A teaches what User B wants to learn, AND User B teaches what User A wants to learn.
 * - 1 (Partial Match): Only one direction matches (either A teaches what B wants, or B teaches what A wants).
 * - 0 (No Match): There is no overlap in teaching and learning skills.
 * 
 * @param {Object} userA - The first user (usually the logged-in user)
 * @param {Object} userB - The second user (being matched against)
 * @returns {Object} - An object containing the match score, type, and matching details
 */
const calculateMatchScore = (userA, userB) => {
  // If either user profile is missing, return 0 (no match)
  if (!userA || !userB) {
    return {
      score: 0,
      type: 'none',
      myMatchingTeach: [],
      theirMatchingTeach: []
    };
  }

  // Handle default empty arrays
  const aTeaches = userA.teachingSkills || [];
  const aWants = userA.learningSkills || [];
  const bTeaches = userB.teachingSkills || [];
  const bWants = userB.learningSkills || [];

  // 1. What A can teach that B wants to learn
  const aTeachesBWants = aTeaches.filter(skill => bWants.includes(skill));

  // 2. What B can teach that A wants to learn
  const bTeachesAWants = bTeaches.filter(skill => aWants.includes(skill));

  const hasDirection1 = aTeachesBWants.length > 0;
  const hasDirection2 = bTeachesAWants.length > 0;

  if (hasDirection1 && hasDirection2) {
    return {
      score: 2,
      type: 'strong',
      myMatchingTeach: aTeachesBWants,
      theirMatchingTeach: bTeachesAWants
    };
  } else if (hasDirection1 || hasDirection2) {
    return {
      score: 1,
      type: 'partial',
      myMatchingTeach: aTeachesBWants,
      theirMatchingTeach: bTeachesAWants
    };
  } else {
    return {
      score: 0,
      type: 'none',
      myMatchingTeach: [],
      theirMatchingTeach: []
    };
  }
};

module.exports = { calculateMatchScore };
