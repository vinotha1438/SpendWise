// Small, dependency-free validation helpers shared across
// controllers. Keeping these in one place means a future
// "self transfer" or other money-moving feature reuses the exact
// same rules instead of re-implementing (and potentially
// re-getting-wrong) amount/date checks a third or fourth time.

const isValidAmount = (amount) => {
  const num = Number(amount);

  return (
    amount !== null &&
    amount !== undefined &&
    amount !== "" &&
    !Number.isNaN(num) &&
    Number.isFinite(num) &&
    num > 0
  );
};

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidDate = (value) => {
  if (!value) return false;

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime());
};

module.exports = {
  isValidAmount,
  isNonEmptyString,
  isValidDate,
};