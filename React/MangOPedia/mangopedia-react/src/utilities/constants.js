export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  CHECKOUT: "/checkout",
  MENU_ITEM_MANAGEMENT: "/menu-item-management",
  MENU_ITEM_DETAILS: "/menu/:id",
  ORDER_CONFIRMATION: "/order-confirmation",
  ORDER_MANAGEMENT: "/order-management",
};

export const API_BASE_URL = "https://localhost:7067";

export const CATEGORIES = ["Appetizer", "Entrée", "Dessert"];

export const ROLES = {
  Admin: "Admin",
  Customer: "Customer",
};

export const SPECIAL_TAGS = [
  "Best Seller",
  "Top Rated",
  "Chef's Special",
  "New Arrival",
  "Seasonal",
];

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

export const ORDER_STATUS = {
  CONFIRMED: "Confirmed",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export const ORDER_STATUS_VALUE_OPTIONS = [
  {
    value: "Confirmed",
    label: "Confirmed",
    color: "info",
  },
  {
    value: "Ready for Pickup",
    label: "Ready for Pickup",
    color: "warning",
  },
  {
    value: "Completed",
    label: "Completed",
    color: "success",
  },
  {
    value: "Canceled",
    label: "Canceled",
    color: "danger",
  },
];
