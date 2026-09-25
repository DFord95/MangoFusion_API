import { ORDER_STATUS_VALUE_OPTIONS, ROLES } from "../../utilities/constants";
import OrdersTable from "../../components/orders/OrdersTable";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../../store/api/orderApi";
import { toast } from "react-toastify";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import { useState } from "react";
import { useSelector } from "react-redux";

function OrderManagement() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === ROLES.Admin;

  let userId = "";

  if (!isAdmin && user) {
    userId = user.id;
  }

  const {
    data: orders = [],
    error,
    isLoading,
    refetch,
  } = useGetOrdersQuery(userId, { refetchOnMountOrArgChange: true });

  const [updateOrder] = useUpdateOrderMutation();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateOrderDetails, setUpdateOrderDetails] = useState({
    orderStatus: "",
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const handleEditOrder = (order) => {
    setUpdateOrderDetails({ orderStatus: "" });
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter
      ? order.orderStatus === statusFilter
      : true;
    const matchesSearch = searchFilter
      ? order.pickUpName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        order.pickUpEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
        order.pickUpPhoneNumber
          .toLowerCase()
          .includes(searchFilter.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  //console.log(orders);

  const handleFormChange = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !isAdmin || !updateOrderDetails.orderStatus) {
      toast.error("You are not authorized to update this order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateOrder({
        id: selectedOrder.orderHeaderId,
        formData: {
          orderHeaderId: selectedOrder.orderHeaderId,
          pickUpName: selectedOrder.pickUpName,
          pickUpPhoneNumber: selectedOrder.pickUpPhoneNumber,
          pickUpEmail: selectedOrder.pickUpEmail,
          orderStatus: updateOrderDetails.orderStatus,
        },
      });

      if (!result.error && result.data?.isSuccess) {
        toast.success("Order updated successfully!");
        refetch();
        setShowModal(false);
        setSelectedOrder(null);
      } else {
        toast.error(
          result.error?.data?.errorMessages?.[0] ||
            result.data?.errorMessages?.[0] ||
            "Failed to update order.",
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to update order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container-fluid p-4 mx-3">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Order Management</h2>
              <p className="text-muted mb-0">Manage your restaurant's orders</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div>
                <label className="form-label small fw-semibold text-uppercase text-muted mb-1">
                  Search Customer
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or phone..."
                  style={{ minWidth: "350px" }}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label small fw-semibold text-uppercase text-muted mb-1">
                  Filter by Status
                </label>
                <select
                  className="form-select"
                  style={{ minWidth: "200px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Orders</option>
                  {ORDER_STATUS_VALUE_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <OrdersTable
                orders={filteredOrders}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={handleEditOrder}
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <OrderDetailsModal
          isAdmin={isAdmin}
          formData={selectedOrder}
          onClose={handleFormClose}
          onSubmit={handleFormChange}
          isSubmitting={isSubmitting}
          updateOrderDetails={updateOrderDetails}
          onUpdateOrderDetails={setUpdateOrderDetails}
        />
      )}
    </div>
  );
}

export default OrderManagement;
