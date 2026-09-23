import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY_CART = "cart";

const getStoredCartItems = () => {
  const storedCart = localStorage.getItem(STORAGE_KEY_CART);

  if (storedCart !== "undefined") {
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(cartItems) ? cartItems : [];
  } else {
    localStorage.removeItem(STORAGE_KEY_CART);
    return [];
  }
};

const saveCartItems = (cartItems) => {
  if (cartItems !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
  } else {
    console.warn(
      "Failed to save cart items: cartItems is undefined",
      cartItems,
    );
  }
};

const calculateCartTotal = (cartItems = []) => {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of cartItems) {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  }

  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [...getStoredCartItems()] || [],
    ...calculateCartTotal(getStoredCartItems()),
  },
  reducers: {
    addToCart: (state, action) => {
      const { item } = action.payload;

      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }

      const { totalItems, totalPrice } = calculateCartTotal(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;

      saveCartItems(state.items);
    },

    removeFromCart: (state, action) => {
      const { item } = action.payload;

      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItemIndex >= 0) {
        state.items.splice(existingItemIndex, 1);
      }

      const { totalItems, totalPrice } = calculateCartTotal(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;

      saveCartItems(state.items);
    },

    updateItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === itemId,
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity = quantity;
      }

      const { totalItems, totalPrice } = calculateCartTotal(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;

      saveCartItems(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      saveCartItems(state.items);
    },
  },
});

export const { addToCart, clearCart, removeFromCart, updateItemQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
