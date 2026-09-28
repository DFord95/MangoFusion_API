import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";

function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    try {
      await resetPassword({
        email,
        token,
        newPassword,
        confirmPassword,
      }).unwrap();
      setComplete(true);
      setSearchParams({}, { replace: true });
    } catch (response) {
      toast.error(
        response?.data?.errorMessages?.[0] ||
          "This link is invalid or expired. Request a new one.",
      );
    }
  };

  return (
    <div className="container py-5">
      <div
        className="mx-auto border rounded-3 shadow-sm bg-body p-4"
        style={{ maxWidth: "440px" }}
      >
        <h1 className="h4 fw-bold">Choose a new password</h1>
        {complete ? (
          <p role="status" className="text-body-secondary">
            Your password has been reset.
          </p>
        ) : !email || !token ? (
          <p className="text-danger">
            This reset link is invalid. Request a new one.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password" className="form-label">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className="form-control mb-3"
              autoComplete="new-password"
              required
              minLength={6}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <label htmlFor="confirm-password" className="form-label">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="form-control mb-3"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Reset password"}
            </button>
          </form>
        )}
        <Link
          to={complete ? "/login" : "/forgot-password"}
          className="d-block mt-3 text-center"
        >
          {complete ? "Sign in" : "Request a new link"}
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
