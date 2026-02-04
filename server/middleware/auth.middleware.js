import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Get token from the authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decodedData = jwt.verify(token, "test_secret");

    // go into depth later
    req.userId = decodedData?.id;

    next(); // Move to the next function i.e the actual route
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
