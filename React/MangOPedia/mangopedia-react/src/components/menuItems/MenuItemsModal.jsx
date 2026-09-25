import React, { useState } from "react";
import { CATEGORIES, SPECIAL_TAGS } from "../../utilities/constants";
import { toast } from "react-toastify";

function MenuItemModal({
  onClose,
  isSubmitting,
  formData,
  onSubmit,
  onChange,
  isEditing,
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};

    const errors = [];

    if (!formData.name?.trim()) {
      errors.push("Name is required.");
      validationErrors.name = "Name is required.";
    }

    if (!formData.category?.trim()) {
      errors.push("Category is required.");
      validationErrors.category = "Category is required.";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || Number.isNaN(price) || price < 1 || price > 1000) {
      errors.push("Price must be between 1.00 and 1000.00.");
      validationErrors.price = "Price must be between 1.00 and 1000.00.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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

    onSubmit(formData);
  };

  return (
    <>
      {/* Bootstrap Modal Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Bootstrap Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className={`modal-dialog modal-lg`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name || ""}
                        onChange={onChange}
                      />
                      {errors.name && (
                        <div className="text-danger small mt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category || ""}
                        onChange={onChange}
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((category) => (
                          <option value={category} key={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <div className="text-danger small mt-1">
                          {errors.category}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description || ""}
                    onChange={onChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price * ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        step="0.01"
                        min="1.00"
                        value={formData.price || ""}
                        onChange={onChange}
                      />
                      {errors.price && (
                        <div className="text-danger small mt-1">
                          {errors.price}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Special Tag</label>
                      <select
                        className="form-select"
                        name="specialTag"
                        value={formData.specialTag || ""}
                        onChange={onChange}
                      >
                        <option value="">Select Special Tag</option>
                        {SPECIAL_TAGS.map((tag) => (
                          <option value={tag} key={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={onChange}
                  />
                  <div className="form-text">
                    Upload an image for the menu item
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <>{isEditing ? "UPDATE MENU ITEM" : "CREATE MENU ITEM"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuItemModal;
