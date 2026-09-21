import { Routes, Route } from "react-router-dom";
import MenuItemDetails from "../pages/menu/MenuItemDetails";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Cart from "../pages/cart/Cart";
import CheckOut from "../pages/cart/CheckOut";
import MenuItemManagement from "../pages/menu/MenuItemManagement";
import OrderConfirmation from "../pages/order/OrderConfirmation";
import OrderManagement from "../pages/order/OrderManagement";
import { ROUTES } from "../utilities/constants";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.CHECKOUT} element={<CheckOut />} />
      <Route path={ROUTES.MENU_ITEM_DETAILS} element={<MenuItemDetails />} />
      <Route
        path={ROUTES.MENU_ITEM_MANAGEMENT}
        element={<MenuItemManagement />}
      />
      <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmation />} />
      <Route path={ROUTES.ORDER_MANAGEMENT} element={<OrderManagement />} />
    </Routes>
  );
};

export default AppRoutes;
