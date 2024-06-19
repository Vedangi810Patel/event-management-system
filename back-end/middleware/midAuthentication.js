const jwt = require("jsonwebtoken");
const midToken = "user";

module.exports = (req, res, next) => {
  try {
    console.log("Middleware")
    const token = req.header("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, midToken);
    // console.log(token)
    if (req.body.email && req.body.email !== decodedToken.user_email) {
      throw new Error("Invalid User with email!");
    } else {
      req.user = decodedToken;
      // console.log(req.user);
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Not Authorized!",
    });
  }
};
