const config = require("../config");
const jwt = require("jsonwebtoken");

const sendErr = (res) => {
  res.status = 401;
  res.send({
    status: 401,
    message: "Not authorized",
  });
};

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    sendErr(res);
  }

  const token = authHeader && authHeader.split(" ")[1];
  const authData = jwt.verify(token, config.firm);

  //Saving the role
  res.locals.isAdmin = authData.role;

  if (authData) {
    return next();
  }

  sendErr(res);
};
