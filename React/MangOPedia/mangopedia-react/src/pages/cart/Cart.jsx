import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateItemQuantity,
  clearCart,
  removeFromCart,
} from "../../store/slice/cartSlice";
import { API_BASE_URL } from "../../utilities/constants";
import { useCreateOrderMutation } from "../../store/api/orderApi";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: cartItems,
    totalItems,
    totalPrice,
  } = useSelector((state) => state.cart);

  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);

  const handleUpdateItemQuantity = (itemId, quantity) => {
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedQuantity)) {
      setQuantity("");
      return;
    }

    setQuantity(parsedQuantity);

    if (parsedQuantity < 1) {
      const item = cartItems.find((cartItem) => cartItem.id === itemId);
      handleRemoveFromCart({ id: itemId, name: item?.name });
      return;
    }

    dispatch(updateItemQuantity({ itemId, quantity: parsedQuantity }));
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart({ item }));
    toast.success(`${item.name} removed from cart`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const [formData, setFormData] = useState({
    pickUpName: user?.fullName || "",
    pickUpEmail: user?.email || "",
    pickUpPhoneNumber: "",
  });

  const redirectToHome = useNavigate();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    if (
      !formData.pickUpName.trim() ||
      !formData.pickUpEmail.trim() ||
      !formData.pickUpPhoneNumber.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (errors.length > 0) {
      toast.error(
        <div>
          <strong>Please correct the following errors:</strong>
          <ul className="mb-0 mt-1 ps-3">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
      );
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to place an order");
      return;
    }

    const orderData = {
      pickUpName: formData.pickUpName,
      pickUpEmail: formData.pickUpEmail,
      pickUpPhoneNumber: formData.pickUpPhoneNumber,
      applicationUserId: user?.id,
      orderTotal: totalPrice,
      totalItems: totalItems,
      orderDetailsDTO: cartItems.map((item) => ({
        menuItemId: item.id,
        itemName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    console.log(orderData);
    const orderResponse = await createOrder(orderData);

    if (orderResponse.error) {
      toast.error(
        orderResponse.error?.data?.errorMessages?.[0] ||
          "Failed to place order",
      );
      return;
    }

    if (orderResponse.data?.isSuccess) {
      toast.success("Order placed successfully!");
      //redirectToHome("/");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="display-4 mb-3 text-muted">
              <i className="bi bi-cart"></i>
            </div>
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any items yet.
            </p>
            <a href="/" className="btn btn-primary btn-lg">
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid p-4 " style={{ minHeight: "100vh" }}>
        {/* Dashboard Header */}

        <div className="row g-4 pt-3">
          {/* Left Column - Cart Management */}
          <div className="col-lg-8">
            <div className="card rounded shadow-sm">
              {/* Cart Header */}
              <div className="p-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-cart3 me-2"></i>
                    Your Shopping Cart
                  </h5>
                  <div className="text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Review and modify your order
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div
                className="p-4"
                style={{ maxHeight: "600px", overflowY: "auto" }}
              >
                <div className="row g-3">
                  {cartItems.map((item) => (
                    <div className="col-12" key={item.id}>
                      <div className="border rounded p-3 border-light hover-shadow">
                        <div className="d-flex align-items-center gap-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={`${API_BASE_URL}/${item.image}`}
                              style={{
                                height: "220px",
                                objectFit: "cover",
                                transition: "transform 0.3s ease",
                              }}
                              onError={(e) => {
                                e.target.src = `"https://placehold.co/100"`;
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow-1">
                            <div className="row align-items-center">
                              <div className="col-md-4">
                                <h6 className="mb-1 fw-semibold">
                                  {item.name}
                                </h6>
                                <div className="text-muted small">
                                  ${parseFloat(item.price).toFixed(2)} each
                                </div>
                              </div>

                              <div className="col-sm-4">
                                <label className="form-label small text-muted">
                                  Quantity
                                </label>
                                <div className="input-group input-group-sm">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    disabled={item.quantity <= 1}
                                    onClick={() =>
                                      handleUpdateItemQuantity(
                                        item.id,
                                        Math.max(1, item.quantity - 1),
                                      )
                                    }
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <input
                                    type="number"
                                    className="form-control text-center"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleUpdateItemQuantity(
                                        item.id,
                                        parseInt(e.target.value),
                                      )
                                    }
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    disabled={item.quantity >= 50}
                                    onClick={() =>
                                      handleUpdateItemQuantity(
                                        item.id,
                                        item.quantity + 1,
                                      )
                                    }
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                              </div>

                              <div className="col-md-3">
                                <label className="form-label small text-muted">
                                  Subtotal
                                </label>
                                <div className="fw-bold text-primary fs-5">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>

                              <div className="col-md-2">
                                <button
                                  className="btn btn-outline-danger btn-sm w-100"
                                  title="Remove item"
                                  onClick={() =>
                                    handleRemoveFromCart({
                                      id: item.id,
                                      name: item.name,
                                    })
                                  }
                                >
                                  <i className="bi bi-trash3"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Total */}
              <div className="p-4 border-top border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold h6 mb-0">
                    <i className="bi bi-calculator me-2"></i>
                    Cart Total ({totalItems} items)
                  </span>
                  <span className="fw-bold text-primary h4 mb-0">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-top p-4">
                <div className="d-flex gap-3 justify-content-center">
                  <Link
                    to="/"
                    className="btn btn-outline-secondary px-4 rounded-pill"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                  <button
                    className="btn btn-outline-danger px-4 rounded-pill"
                    onClick={handleClearCart}
                  >
                    <i className="bi bi-trash3 me-2"></i>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Checkout Panel */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "20px" }}>
              <form onSubmit={handleSubmit}>
                <div className="card rounded shadow-sm">
                  <div className="p-4">
                    {/* Order Summary */}

                    {/* Pickup Information */}
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">
                        <i className="bi bi-person-check me-2"></i>
                        Pickup Details
                      </h5>
                      <p className="text-muted small mt-2 mb-0">
                        Fields marked <span className="text-danger">*</span> are
                        required.
                      </p>

                      <div className="row g-3">
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="pickUpName"
                              name="pickUpName"
                              placeholder="Full Name"
                              value={formData.pickUpName}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="pickUpName">
                              Full Name <span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="tel"
                              className="form-control"
                              id="pickUpPhoneNumber"
                              name="pickUpPhoneNumber"
                              placeholder="Phone Number"
                              value={formData.pickUpPhoneNumber}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="pickUpPhoneNumber">
                              Phone Number{" "}
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="email"
                              className="form-control"
                              id="pickUpEmail"
                              name="pickUpEmail"
                              placeholder="Email"
                              value={formData.pickUpEmail}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="pickUpEmail">
                              Email Address{" "}
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="d-grid">
                      <button className="btn btn-primary btn-lg" type="submit">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                        <i className="bi bi-credit-card me-2"></i>
                        Place Order (${totalPrice.toFixed(2)})
                      </button>
                    </div>
                  </div>

                  {/* Pickup Info */}
                  <div className="border-top p-4">
                    <div className="alert alert-info small mb-0">
                      <i className="bi bi-clock me-2"></i>
                      <strong>Ready in 15-20 mins</strong> after order
                      confirmation
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
