import { useGetMenuItemsQuery } from "../store/api/menuItemApi";
import { API_BASE_URL, CATEGORIES } from "../utilities/constants";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice/cartSlice";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const {
    data: menuItems = [],
    error,
    isLoading,
    refetch,
  } = useGetMenuItemsQuery();

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      }),
    );
    toast.success(`${item.name} added to cart!`);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearchTerm = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className="container-fluid px-0 py-4">
      {/* Hero Section */}

      <div className="container" id="menu">
        {/* Filters */}
        <div className="row g-4 align-items-end mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small text-uppercase">
              Search
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small text-uppercase">
              Category
            </label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Loading State */}
        {isLoading && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
            <div className="col">
              <div className="card h-100 placeholder-glow">
                <div
                  className="card-img-top bg-body-secondary"
                  style={{ height: "180px" }}
                ></div>
                <div className="card-body">
                  <h5 className="card-title placeholder col-6"></h5>
                  <p className="card-text placeholder col-9"></p>
                  <p className="card-text placeholder col-4"></p>
                  <div className="d-flex gap-2 mt-3">
                    <span className="placeholder btn btn-primary disabled col-6"></span>
                    <span className="placeholder btn btn-outline-primary disabled col-6"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            Error loading menu items: {error.message || "Unknown error"}
          </div>
        )}

        {!isLoading &&
          !error &&
          (filteredMenuItems.length === 0 ? (
            <div className="text-center py-5">
              <h4>No menu items found</h4>
              <p className="text-muted">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
              {filteredMenuItems.map((item) => (
                <div className="col" key={item.id}>
                  <div className="card h-100 border shadow-sm position-relative">
                    <div className="position-relative overflow-hidden rounded-top">
                      <img
                        className="card-img-top"
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

                      {item.specialTag && (
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-warning text-dark px-3 py-1 rounded-3 shadow-sm fw-semibold">
                            {item.specialTag}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title fw-bold mb-0 text-dark lh-sm flex-grow-1 me-3">
                          {item.name}
                        </h5>
                        <div className="h4 text-primary fw-bold mb-0 flex-shrink-0">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                      </div>

                      {/* Category and Rating Row */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge text-secondary border px-2 py-1 small">
                          {item.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className="card-text text-muted mb-4 flex-grow-1"
                        style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
                      >
                        {item.description?.length > 100
                          ? `${item.description?.substring(0, 100)}...`
                          : item.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="mt-auto">
                        <div className="row g-2">
                          <div className="col-6">
                            <Link
                              to={`/menu/${item.id}`}
                              className="btn btn-outline-primary w-100 btn-sm fw-semibold"
                            >
                              <i className="bi bi-info-circle me-1"></i>Details
                            </Link>
                          </div>
                          <div className="col-6">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="btn btn-primary w-100 btn-sm fw-semibold"
                            >
                              <i className="bi bi-cart-plus me-1"></i>Add to
                              Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="position-absolute bottom-0 start-0 w-100"
                      style={{
                        height: "3px",
                        background:
                          "linear-gradient(90deg, var(--bs-primary), transparent)",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Features Section */}
        <section className="py-5 border-top">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose MangoFusion?</h2>
            <p className="text-muted mb-0">
              We deliver freshness, flavor, and a premium ordering experience.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i
                    className="bi bi-egg-fried text-primary"
                    style={{ fontSize: "2.5rem" }}
                  ></i>
                  <h5 className="mt-3">Quality Food</h5>
                  <p className="text-muted small mb-0">
                    Fresh ingredients and authentic recipes for exceptional
                    taste.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i
                    className="bi bi-lightning-charge text-primary"
                    style={{ fontSize: "2.5rem" }}
                  ></i>
                  <h5 className="mt-3">Fast Pickup</h5>
                  <p className="text-muted small mb-0">
                    Quick preparation and streamlined collection process.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i
                    className="bi bi-stars text-primary"
                    style={{ fontSize: "2.5rem" }}
                  ></i>
                  <h5 className="mt-3">Great Service</h5>
                  <p className="text-muted small mb-0">
                    Friendly support and attention to every detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
