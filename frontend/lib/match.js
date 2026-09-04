/**
 * Maps match scores to visual styles and text explanations for the UI.
 * 
 * @param {Object} match - The match object returned from the backend API
 * @returns {Object} - Formatting data (label, color classes, descriptions)
 */
export const getMatchBadgeDetails = (match) => {
  if (!match || match.score === 0 || match.type === 'none') {
    return {
      label: 'No Match',
      color: 'bg-gray-100 text-gray-600 border border-gray-200',
      description: 'No current skill overlap.'
    };
  }

  if (match.score === 1 || match.type === 'partial') {
    return {
      label: 'Partial Match',
      color: 'bg-yellow-50 text-warning border border-warning/30',
      description: 'One of you teaches what the other wants to learn.'
    };
  }

  if (match.score === 2 || match.type === 'strong') {
    return {
      label: 'Strong Match',
      color: 'bg-green-50 text-success border border-success/30',
      description: 'Great Match! You can teach each other what you want to learn.'
    };
  }

  return {
    label: 'No Match',
    color: 'bg-gray-100 text-gray-600 border border-gray-200',
    description: 'No current skill overlap.'
  };
};
