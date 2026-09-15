import MenuItemsTable from "../../components/menuItems/MenuItemsTable";
import { useGetMenuItemsQuery } from "../../store/api/menuItemApi";
import MenuItemModal from "../../components/menuItems/MenuItemModal";

function MenuItemManagement() {
  const {
    data: menuItems = [],
    error,
    isLoading,
    refetch,
  } = useGetMenuItemsQuery();

  console.log(menuItems);

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
            <button className="btn btn-primary">
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
              />
            </div>
          </div>
        </div>
      </div>
      <MenuItemModal />
    </div>
  );
}

export default MenuItemManagement;
