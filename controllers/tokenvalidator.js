const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // console.log("Authentication");
  // console.log(req.app.get("supersecret"));
  // console.log(token);
  if (token) {
    jwt.verify(token, req.app.get("supersecret"), (err, decoded) => {
      if (err) {
        // console.log("Error");
        return res.status(500).json({success: false, message: "Authentication failed. Failed to authenticate token."});
      } else {
        // console.log("Decoded");
        req.token = decoded; // Store decoded token in req.token
        next();
      }
    });

  } else {
    return res.status(500).json({success: false, message: "Please Log In"})
  }
}
