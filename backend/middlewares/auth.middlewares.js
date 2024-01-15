const { BlackListModel } = require("../model/blacklist");
const jwt = require("jsonwebtoken");

const auth = async (req, res , next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      const blcktoken = await BlackListModel.findOne({ token });
      if (blcktoken) {
        res.status(400).json({ msg: "Please Login" });
      } else {
        jwt.verify(token, "masai", (err, decoded) => {
          if (err) {
            res.status(400).json({ msg: "Please Login" });
          } else {
            req.body.userId = decoded.userId;
            next();
          }
        });
      }
    } else {
      res.status(400).json({ msg: "Please Login" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = { auth };
