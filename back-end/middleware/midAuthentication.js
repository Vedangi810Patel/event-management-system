const jwt = require("jsonwebtoken");
const midToken = "user";

module.exports = (req, res, next) => {
  try {
    console.log("Middleware");
    const token = req.header("Authorization").split(" ")[1];
    console.log(token)
    const decodedToken = jwt.verify(token, midToken);
    const sentEmail = decodedToken.email;
    if (req.body.email && req.body.email !== sentEmail) {
      throw "Indalid User with email !";
    } else {
      req.user = decodedToken;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Not Authorized!"),
    });
  }
};