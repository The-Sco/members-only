const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("[ERROR LOG]:", err);
  req.flash("notification", {
    success: false,
    msg: `An error has occurred 😔`,
  });
  res.redirect("/messages");
};

export default errorHandler;
