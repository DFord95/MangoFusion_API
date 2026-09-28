# MangoFusion_API

## Account email

Registration sends an ASP.NET Identity confirmation link to `/confirm-email` and routes the new user to a page where they can resend the link. The API also provides `/api/Auth/ConfirmEmail` and `/api/Auth/ResendConfirmation`. Resend returns the same response for unknown and already-confirmed accounts. Existing unconfirmed accounts can still sign in; enabling mandatory confirmation should wait until SMTP delivery is verified and existing accounts have a migration path.

### Password recovery

The React sign-in page links to `/forgot-password`. The API uses ASP.NET Identity password-reset tokens and sends links to `/reset-password` by SMTP. Configure the API using environment variables or user secrets (do not commit credentials):

| Setting                             | Purpose                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `Smtp__Host`                        | SMTP server hostname                                                     |
| `Smtp__Port`                        | SMTP port (default: `587`)                                               |
| `Smtp__From`                        | Sender email address                                                     |
| `Smtp__Username` / `Smtp__Password` | SMTP credentials, if required                                            |
| `Smtp__EnableSsl`                   | TLS enabled by default; set `false` only for a trusted local mail server |
| `PasswordReset__ClientUrl`          | Trusted frontend origin, such as `https://your-site.example`             |

In Development, `PasswordReset__ClientUrl` defaults to `http://localhost:5173`. The same setting is used for confirmation links. In production, configure an HTTPS URL. Until SMTP is configured, account email endpoints return 503 and no email is sent. A generic response for submitted addresses avoids disclosing which accounts exist. Reset and confirmation requests share a limit of five attempts per IP per 15 minutes (HTTP 429 when exceeded).

For an existing `EmailConfig` SMTP account, map `Host` to `Smtp__Host`, `Port` to `Smtp__Port`, `FromAddress` to `Smtp__From`, and its SMTP `Username`/`Password` to the matching `Smtp__` settings. Password-reset emails go to the requesting account, not to a fixed `Recipient`. A server using `SecureSocketOptions.None` can be used without credentials only on a trusted local relay. This API requires TLS (`Smtp__EnableSsl=true`) when SMTP credentials are set; use a STARTTLS-capable port or a secure relay instead of sending a password over a cleartext port-25 connection.

The development config includes the example's non-secret SMTP host, port 25, and sender address with TLS required. In Visual Studio, right-click the API project and choose **Manage User Secrets** to enter `Smtp:Username` and `Smtp:Password` locally. Do not add them to `appsettings*.json`. Confirm that this SMTP server offers STARTTLS on port 25 and authorizes this sender; otherwise request a TLS-enabled SMTP port from the mail administrator. Restart the API after setting secrets. A successful send to a test account is still required to verify delivery.
