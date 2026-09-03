// Shared date-range matching used by both the Dashboard's expense
// list and the Income page — previously each had its own copy of
// this same switch statement.
export function matchesDateFilter(dateValue, filter) {
  if (!filter || filter === "All" || filter === "") {
    return true;
  }

  if (!dateValue) return false;

  const date = new Date(dateValue);
  const today = new Date();

  switch (filter) {
    case "Today":
      return date.toDateString() === today.toDateString();

    case "This Week": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return date >= startOfWeek && date <= endOfWeek;
    }

    case "This Month":
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );

    case "This Year":
      return date.getFullYear() === today.getFullYear();

    default:
      return true;
  }
}

// Shared sort logic for transaction lists — "Newest"/"Oldest" sort
// by the given date field, "Amount High-Low"/"Amount Low-High" sort
// by amount. Returns a NEW sorted array (does not mutate input).
export function sortTransactions(items, sortBy, dateField) {
  const sorted = [...items];

  switch (sortBy) {
    case "Oldest":
      sorted.sort(
        (a, b) =>
          new Date(a[dateField]) - new Date(b[dateField])
      );
      break;

    case "Amount High-Low":
      sorted.sort(
        (a, b) => Number(b.amount) - Number(a.amount)
      );
      break;

    case "Amount Low-High":
      sorted.sort(
        (a, b) => Number(a.amount) - Number(b.amount)
      );
      break;

    case "Newest":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b[dateField]) - new Date(a[dateField])
      );
  }

  return sorted;
}
