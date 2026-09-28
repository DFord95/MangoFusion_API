import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await forgotPassword(email.trim()).unwrap();
      setSent(true);
    } catch {
      toast.error(
        "We couldn't send the request right now. Please try again later.",
      );
    }
  };

  return (
    <div className="container py-5">
      <div
        className="mx-auto border rounded-3 shadow-sm bg-body p-4"
        style={{ maxWidth: "440px" }}
      >
        <h1 className="h4 fw-bold">Reset your password</h1>
        {sent ? (
          <p role="status" className="text-body-secondary mb-3">
            If an account exists for that email, we'll send a password reset
            link.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="reset-email" className="form-label">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              className="form-control mb-3"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
        <Link to="/login" className="d-block mt-3 text-center">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
