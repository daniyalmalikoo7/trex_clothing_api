const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(500).json("Please enter all required fields");
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const registeredUser = await newUser.save();
    res.status(201).json(registeredUser);
    console.log("registeredUser", registeredUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  console.log("login", req.body);
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json("Wrong credentials! ");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); //If you're using any other character, you can write here specific version.
    if (req.body.password === originalPassword) {
      const accessToken = JWT.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );

      console.log("JWT", accessToken);
      const { password, ...userDetails } = user._doc;
      res.status(200).json({ ...userDetails, accessToken });
    } else {
      res.status(401).json("Wrong credentials! ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
