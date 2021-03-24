module.exports = (req, res, next) => {
  //Get role
  const isAdmin = res.locals.isAdmin;

  if (isAdmin === "admin") {
    return next();
  }

  res.status = 401;
  res.send({
    status: 401,
    message: "Not authorized",
  });
};
