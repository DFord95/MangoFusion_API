import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useConfirmEmailMutation,
  useResendConfirmationMutation,
} from "../../store/api/authApi";

function ConfirmEmail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmEmail, { isLoading: isConfirming }] = useConfirmEmailMutation();
  const [resendConfirmation, { isLoading: isSending }] =
    useResendConfirmationMutation();

  const handleConfirm = async () => {
    setError("");
    try {
      await confirmEmail({ email, token }).unwrap();
      setConfirmed(true);
      setSearchParams({}, { replace: true });
    } catch (response) {
      setError(
        response?.data?.errorMessages?.[0] ||
          "This confirmation link is invalid or expired.",
      );
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await resendConfirmation(email.trim()).unwrap();
      setMessage(
        "If an unconfirmed account exists for this email, a new link has been sent.",
      );
    } catch {
      setError(
        "We couldn't send a confirmation link right now. Please try again later.",
      );
    }
  };

  return (
    <div className="container py-5">
      <div
        className="mx-auto border rounded-3 shadow-sm bg-body p-4"
        style={{ maxWidth: "440px" }}
      >
        <h1 className="h4 fw-bold mb-3">Confirm your email</h1>
        {confirmed ? (
          <p role="status" className="text-success">
            Your email is confirmed. You can sign in now.
          </p>
        ) : token && email ? (
          <>
            <p className="text-body-secondary">
              Confirm {email} to finish setting up your account.
            </p>
            <button
              type="button"
              className="btn btn-primary w-100"
              disabled={isConfirming}
              onClick={handleConfirm}
            >
              {isConfirming ? "Confirming..." : "Confirm email"}
            </button>
          </>
        ) : (
          <p className="text-body-secondary">
            Check your inbox for the confirmation link.
          </p>
        )}
        {!confirmed && (
          <form onSubmit={handleResend} className="mt-4">
            <label htmlFor="confirmation-email" className="form-label">
              Send a new link
            </label>
            <input
              id="confirmation-email"
              type="email"
              className="form-control mb-2"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button
              type="submit"
              className="btn btn-outline-primary w-100"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Resend confirmation"}
            </button>
          </form>
        )}
        {message && (
          <p role="status" className="text-body-secondary mt-3 mb-0">
            {message}
          </p>
        )}
        {error && (
          <div role="alert" className="alert alert-danger mt-3 mb-0">
            {error}
          </div>
        )}
        <Link to="/login" className="d-block mt-3 text-center">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ConfirmEmail;
