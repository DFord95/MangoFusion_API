import { getConditionalOrderStatusColor } from "../../utilities/helperFunc";
import { formatDate, formatPhoneNumber } from "../../utilities/formatters";

function OrdersTable({ orders, isLoading, error, refetch, onEdit }) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error Loading Orders</h5>
        <p>An error occurred while loading orders.</p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-basket text-muted" style={{ fontSize: "3rem" }}></i>
        <h4 className="mt-3 text-muted">No Orders</h4>
        <p className="text-muted">Start by adding your first order.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order #</th>
              <th>Order Date</th>
              <th>Customer Details</th>
              <th>Total Items</th>
              <th>Order Total</th>
              <th>Order Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderHeaderId}>
                <td className="fw-semibold">#{order.orderHeaderId}</td>
                <td>
                  <strong>{formatDate(order.orderDate)}</strong>
                </td>
                <td>
                  <div className="small text-muted">
                    <div className="fw-semibold">{order.pickUpName}</div>
                    <div>{order.pickUpEmail}</div>
                    <div>{formatPhoneNumber(order.pickUpPhoneNumber)}</div>
                  </div>
                </td>
                <td>
                  <strong>{order.totalItems}</strong>
                </td>
                <td>
                  <span className="badge text-bg-secondary">
                    ${parseFloat(order.orderTotal || 0).toFixed(2)}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge text-bg-${getConditionalOrderStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-success"
                      title="Edit"
                      onClick={() => onEdit(order)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OrdersTable;
