import MenuItemsTable from "../../components/menuItems/MenuItemsTable";
import {
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "../../store/api/menuItemApi";
import { toast } from "react-toastify";
import MenuItemModal from "../../components/menuItems/MenuItemModal";
import { useState } from "react";
import Swal from "sweetalert2";

function MenuItemManagement() {
  const {
    data: menuItems = [],
    error,
    isLoading,
    refetch,
  } = useGetMenuItemsQuery();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    specialTag: "",
    image: null,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      specialTag: "",
      image: null,
    });
  };

  const handleFormChange = async (formData) => {
    setIsSubmitting(true);
    try {
      // Call create menu item API

      const formDataToSend = new FormData();

      formDataToSend.append("Name", formData.name);
      formDataToSend.append("Category", formData.category);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("SpecialTag", formData.specialTag);

      if (formData.image) {
        formDataToSend.append("Image", formData.image);
      }

      // Edit existing menu item
      if (selectedMenuItem) {
        formDataToSend.append("Id", selectedMenuItem.id);
        const result = await updateMenuItem({
          id: selectedMenuItem.id,
          formData: formDataToSend,
        });
        if (result.isSuccess !== false) {
          toast.success("Menu item updated successfully!");
          refetch();
        } else {
          toast.error("Failed to update menu item.");
        }
      } else {
        // Create new menu item
        const result = await createMenuItem(formDataToSend);
        if (result.isSuccess !== false) {
          toast.success("Menu item created successfully!");
          refetch();
        } else {
          toast.error("Failed to create menu item.");
        }
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.log("Error updating form data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    console.log("Input changed:", name, value, files);

    if (name === "image" && files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      return;
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleAddMenuItem = () => {
    setShowModal(false);
    resetForm();
    setSelectedMenuItem(null);
  };

  const handleEditMenuItem = (item) => {
    setSelectedMenuItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      price: item.price || "",
      specialTag: item.specialTag || "",
      image: null,
    });
    setShowModal(true);
  };

  const handleDeleteMenuItem = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Call delete menu item API
      await deleteMenuItem(item.id);

      Swal.fire({
        title: "Deleted!",
        text: `Menu item "${item.name}" has been deleted.`,
        icon: "success",
      });
    }
  };

  return (
    <div className="container-fluid p-4 mx-3">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Menu Item Management</h2>
              <p className="text-muted mb-0">
                Manage your restaurant's menu items
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Menu Item
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <MenuItemsTable
                menuItems={menuItems}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={handleEditMenuItem}
                onDelete={handleDeleteMenuItem}
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <MenuItemModal
          onClose={handleAddMenuItem}
          isSubmitting={isSubmitting}
          formData={formData}
          onSubmit={handleFormChange}
          onChange={handleInputChange}
          onDelete={handleDeleteMenuItem}
          onEdit={handleEditMenuItem}
          isEditing={!!selectedMenuItem}
        />
      )}
    </div>
  );
}

export default MenuItemManagement;
