import { ORDER_STATUS_VALUE_OPTIONS } from "./constants";

export const getConditionalOrderStatusColor = (status) => {
  const statusColorMap = ORDER_STATUS_VALUE_OPTIONS.reduce(
    (acc, { value, color }) => {
      acc[value] = color;
      return acc;
    },
    {},
  );
  return statusColorMap[status] || "secondary";
};
