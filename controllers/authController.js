const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtKey = "wheels_pak";

exports.SignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name, email, password);
  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  newUser
    .save()
    .then(() => {
      console.log("New User added successfully");
      const userData = {
        name: newUser.name,
        email: newUser.email,
      };
      jwt.sign({ message: "SignUp Successful" }, jwtKey, (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Error creating token" });
        } else {
          res.json({ user: userData, token: token });

          // res.json({ token: token });
        }
      });
    })
    .catch((error) => {
      console.error("Error adding new User:", error);
      res.status(500).json({ error: "Error adding new User" });
    });
};
