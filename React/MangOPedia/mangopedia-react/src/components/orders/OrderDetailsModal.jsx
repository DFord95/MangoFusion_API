import { ORDER_STATUS } from "../../utilities/constants";
import { getConditionalOrderStatusColor } from "../../utilities/helperFunc";
import { formatPhoneNumber, formatDate } from "../../utilities/formatters";

function OrderDetailsModal({
  isAdmin,
  onClose,
  isSubmitting,
  formData,
  onSubmit,
  updateOrderDetails,
  onUpdateOrderDetails,
}) {
  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold mb-0">
                  Order # {formData.orderHeaderId}
                </h5>
                <small className="text-muted">
                  Placed {formatDate(formData?.orderDate) || "N/A"}
                </small>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-close"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit} className="pt-2">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <h6 className="fw-bold mb-2">Order Info</h6>
                      <div className="small mb-1">
                        <strong>Total:</strong> ${formData?.orderTotal || 0}
                      </div>
                      <div className="small">
                        <strong>Status:</strong>
                        <span
                          className={`badge p-2 text-bg-${getConditionalOrderStatusColor(formData?.orderStatus)} ms-1`}
                        >
                          {formData?.orderStatus || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <h6 className="fw-bold mb-2">Customer</h6>
                      <div className="small mb-1">
                        <strong>Name:</strong> {formData?.pickUpName || "N/A"}
                      </div>
                      <div className="small mb-1">
                        <strong>Email:</strong> {formData?.pickUpEmail || "N/A"}
                      </div>
                      <div className="small">
                        <strong>Phone:</strong>{" "}
                        {formatPhoneNumber(formData?.pickUpPhoneNumber) ||
                          "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="border rounded-3 p-3 mb-3">
                    <h6 className="fw-bold mb-2">Update Status</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-uppercase text-muted">
                          Current
                        </label>
                        <div>
                          <span
                            className={`badge disabled text-bg-${getConditionalOrderStatusColor(formData?.orderStatus)}`}
                          >
                            {formData?.orderStatus || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-uppercase text-muted">
                          Change To
                        </label>
                        <select
                          className="form-select"
                          value={updateOrderDetails.orderStatus || ""}
                          onChange={(e) =>
                            onUpdateOrderDetails({
                              ...updateOrderDetails,
                              orderStatus: e.target.value,
                            })
                          }
                        >
                          <option value="">Select...</option>
                          {formData?.orderStatus === ORDER_STATUS.CONFIRMED && (
                            <option value={ORDER_STATUS.READY_FOR_PICKUP}>
                              {ORDER_STATUS.READY_FOR_PICKUP}
                            </option>
                          )}
                          {formData?.orderStatus ===
                            ORDER_STATUS.READY_FOR_PICKUP && (
                            <option value={ORDER_STATUS.COMPLETED}>
                              {ORDER_STATUS.COMPLETED}
                            </option>
                          )}
                          <option value={ORDER_STATUS.CANCELED}>
                            {ORDER_STATUS.CANCELED}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <div className="border rounded-3 p-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0">Items</h6>
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                      <i className="bi bi-star me-1"></i>
                      You can now rate your items
                    </span>
                  </div>
                  <div className="vstack gap-3">
                    {formData?.orderDetails?.length > 0 ? (
                      formData.orderDetails.map((item, index) => (
                        <div key={index} className="border rounded-2 p-3">
                          <div className="d-flex justify-content-between flex-wrap gap-3 mb-2">
                            <div className="flex-grow-1">
                              <div className="fw-semibold">
                                {item.itemName || "N/A"}
                              </div>
                              <div className="small text-muted">
                                Qty {item.quantity || 0} × $
                                {parseFloat(item.price || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Rating section for completed orders */}
                          <div className="mt-3 pt-3 border-top bg-light rounded p-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h6 className="mb-1 fw-semibold small text-primary">
                                  <i className="bi bi-star me-1"></i>
                                  Rate this item
                                </h6>
                                <p className="mb-2 small text-muted">
                                  How was your experience with this item?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted">No items found.</div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 pt-2">
                  <button
                    onClick={onClose}
                    type="button"
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                  {isAdmin && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || !updateOrderDetails.orderStatus}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        "Update Order"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsModal;
