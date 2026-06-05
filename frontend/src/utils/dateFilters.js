export const getRangeDates = (range, customFrom, customTo) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  if (range === "daily") {
    return { from: startOfDay(today), to: today };
  }

  if (range === "weekly") {
    const from = new Date(today);
    from.setDate(from.getDate() - 6);
    return { from: startOfDay(from), to: today };
  }

  if (range === "monthly") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: startOfDay(from), to: today };
  }

  if (range === "custom" && customFrom && customTo) {
    return {
      from: startOfDay(new Date(customFrom)),
      to: new Date(`${customTo}T23:59:59`),
    };
  }

  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: startOfDay(from), to: today };
};

export const filterByDateRange = (records, dateField, range, customFrom, customTo) => {
  const { from, to } = getRangeDates(range, customFrom, customTo);

  return records.filter((record) => {
    const recordDate = new Date(record[dateField]);
    return recordDate >= from && recordDate <= to;
  });
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
