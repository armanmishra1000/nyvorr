// Calculate percentage change between two numbers
function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : 100; // Handle division by zero
  }
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}

module.exports = {
  calculatePercentageChange
};
