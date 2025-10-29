/* eslint-disable no-unused-vars */
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const details = err.details || undefined;

  if (req.app.get("env") !== "production") {
    console.error("[ERROR]", err);
  }

  res.status(status).json({
    ok: false,
    error: { message, details }
  });
}
