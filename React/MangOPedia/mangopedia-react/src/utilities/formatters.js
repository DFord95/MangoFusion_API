export const formatPhoneNumber = (phoneNumber) => {
  const digits = String(phoneNumber ?? "").replace(/\D/g, "");

  if (digits.length !== 10) {
    return phoneNumber || "N/A";
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return "N/A";
  }
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
