import { ROLES } from "../../utilities/constants";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserRegistrationMutation } from "../../store/api/authApi";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleInit: "",
    lastName: "",
    suffix: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.Customer,
  });

  const redirectToHome = useNavigate();

  const [userRegistration, { isLoading, error }] =
    useUserRegistrationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (
      !/^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(
        formData.password,
      )
    ) {
      toast.error(
        "Password must be at least 6 characters and include uppercase, lowercase, number, and special character",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const registeredData = await userRegistration({
      firstName: formData.firstName,
      middleInit: formData.middleInit,
      lastName: formData.lastName,
      suffix: formData.suffix,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (registeredData.error) {
      // console.log(error);
      toast.error(error?.data?.errorMessages?.[0] || "Registration failed");
    } else {
      toast.success("Registration successful");
      redirectToHome("/");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-body-tertiary py-5">
      <div className="container">
        <div className="row g-5 align-items-center justify-content-center">
          {/* Marketing Panel */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="text-center px-4">
              <div className="mb-4">
                <i
                  className="bi bi-stars text-primary"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="fw-bold mb-3">Join MangoFusion</h2>
              <p className="text-muted mb-4">
                Create your account to discover fresh dishes and manage your
                orders.
              </p>
              <div className="text-start mx-auto" style={{ maxWidth: "360px" }}>
                <div className="d-flex mb-2 small">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Personalized experience</span>
                </div>
                <div className="d-flex mb-2 small">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Save favorites & re-order</span>
                </div>
                <div className="d-flex mb-2 small">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Exclusive offers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="border rounded-4 shadow-sm p-4 p-lg-5">
              <div className="mb-4 text-center">
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="text-muted small mb-0">Sign up to get started</p>
                <p className="text-muted small mt-2 mb-0">
                  Fields marked <span className="text-danger">*</span> are
                  required.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label htmlFor="firstName">
                    First Name <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-sm-8">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="middleInit"
                        name="middleInit"
                        placeholder="Middle Initial"
                        value={formData.middleInit}
                        onChange={handleChange}
                      />
                      <label htmlFor="middleInit">Middle Initial</label>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="suffix"
                        name="suffix"
                        placeholder="Suffix"
                        value={formData.suffix}
                        onChange={handleChange}
                      />
                      <label htmlFor="suffix">Suffix</label>
                    </div>
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label htmlFor="lastName">
                    Last Name <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">
                    Email address <span className="text-danger">*</span>
                  </label>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <label htmlFor="password">
                        Password <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="confirmPassword">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-uppercase text-muted">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value={ROLES.Customer}>{ROLES.Customer}</option>
                    <option value={ROLES.Admin}>{ROLES.Admin}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </form>
              <div className="text-center small">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="fw-semibold">
                  Sign in
                </Link>
              </div>
              <div className="text-center mt-3 small">
                <Link to="/" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
