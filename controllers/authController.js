const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtKey = "wheels_pak";
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "supremebilal78@gmail.com",
    pass: "xlifiuqjtmrigppl",
  },
});
let verificationToken;

exports.sendEmailVerification = (req, res, next) => {
  console.log("sending email verification");
  const email = req.body.email;
  const name = req.body.name;
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  verificationToken = Math.floor(Math.random() * (max - min + 1)) + min;
  const mailOptions = {
    from: "pakwheels.com",
    to: email, // Use the user's email here
    subject: "Email Verification",
    text: `Hello ${name},\n\nYour Code is:${verificationToken} `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email verification error:", error);
      return res
        .status(500)
        .json({ error: "Error sending email verification" });
    } else {
      console.log("Email verification sent:", info.response);

      next();
    }
  });
};
exports.verifyEmail = async (req, res, next) => {
  const sixDigitToken = req.body.concatenatedValue;
  console.log("token recieved" + sixDigitToken);
  try {
    // Find the user with this token
    const user = await User.findOne({ verificationToken: sixDigitToken });

    if (!user) {
      console.log("invalid token");
      return res.status(400).json({ error: "Invalid token." });
    }

    console.log("user Found" + user);
    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = null; // Clear the token
    await user
      .save()
      .then(() => {
        console.log("New User added successfully with verified true");
        // const userData = {
        //   _id: user._id,
        //   name: user.name,
        //   email: user.email,
        // };

        // Generate a JWT token for the new user
        jwt.sign(
          { message: "SignUp Successful" },
          jwtKey,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              return res.json({ error: "Error creating token" }); // Send a JSON response
            } else {
              res.json({ user: user, jwttoken: token }); // Send a JSON response
              console.log("token" + token, "user" + user);
            }
          }
        );
      })
      .catch((error) => {
        console.error("Error adding new User:", error);
        res.json({ error: "Error adding new User" }); // Send a JSON response
      });

    // return res.status(200).json({ message: "Email verification successful." });
  } catch (error) {
    console.error("Verification error:", error);

    return res
      .status(500)
      .json({ message: "An error occurred during verification." });
  }
};

exports.isNewUser = (req, res, next) => {
  const email = req.body.email; // Extract email from the request body

  User.findOne({ email: email }).then((user) => {
    console.log("email checked:" + email);

    if (user) {
      console.log("email taken");
      return res.status(400).json({ error: "Email already taken" }); // Use an appropriate HTTP status code, like 400 Bad Request
    }

    console.log("email available");
    next();
  });
};
exports.isPasswordValid = (req, res, next) => {
  const password = req.body.password;

  const minLengthRegex = /^.{8,}$/; // At least 8 characters
  const capitalLetterRegex = /[A-Z]/; // At least one capital letter
  const specialCharacterPattern = "[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-=|\\\\/]"; // Escaped special characters
  const specialCharacterRegex = new RegExp(specialCharacterPattern);

  if (
    !minLengthRegex.test(password) ||
    !capitalLetterRegex.test(password) ||
    !specialCharacterRegex.test(password)
  ) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain at least one capital letter and one special character.",
    });
  }

  next();
};

exports.SignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  console.log("User registration request:", name, email, password);
  // const verificationToken = crypto.randomBytes(20).toString("hex");

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken,
    });

    newUser
      .save()
      .then(() => {
        console.log("New User added successfully with verified false");
        return res
          .status(200)
          .json({ message: "User signup without verified false" });

        // const userData = {
        //   name: newUser.name,
        //   email: newUser.email,
        // };

        // // Generate a JWT token for the new user
        // jwt.sign(
        //   { message: "SignUp Successful" },
        //   jwtKey,
        //   { expiresIn: "1h" },
        //   (err, token) => {
        //     if (err) {
        //       return res.json({ error: "Error creating token" }); // Send a JSON response
        //     } else {
        //       res.json({ user: userData, token: token }); // Send a JSON response
        //     }
        //   }
        // );
      })
      .catch((error) => {
        console.error("Error adding new User:", error);
        res.json({ error: "Error adding new User" }); // Send a JSON response
      });
  });
};

const blacklist = new Set(); // Store blacklisted tokens

exports.SignOut = (req, res, next) => {
  const token = req.body.token; // Get the token from the request body

  blacklist.add(token);

  res.status(200).json({ message: "Token invalidated successfully" }); // Send a JSON response
};

// exports.LogIn = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   User.findOne({ email: email, password: password })
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ message: "Email Invalid" });
//       }
//       bcrypt.compare(password, user.password, (err, result) => {
//         if (err) {
//           console.error("Error comparing passwords:", err);
//           return res.status(500).json({ error: "Error comparing passwords" });
//         }

//         if (result) {

//           jwt.sign(
//             { message: "Login Successful" },
//             jwtKey,
//             { expiresIn: "1h" },
//             (err, token) => {
//               if (err) {
//                 return res.status(500).json({ error: "Error creating token" });
//               } else {
//                 res.status(200).json({ user: user, token: token });
//               }
//             }
//           );
//         } else {
//           // Passwords don't match, return an error response
//           return res.status(401).json({ message: "Invalid password" });
//         }
//       });
//     })
//     .catch((error) => {
//       // Handle any errors that occur during the database query
//       console.error("Login error: " + error);
//       res.status(500).json({ error: "Error during login" });
//     });
// };
exports.checkEmailAndPassword = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("checking email");
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("Email not found");
        return res.status(400).json({ error: "Email not found" });
      }

      // Compare the provided password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ error: "Error comparing passwords" });
        }

        if (result) {
          // Passwords match, attach the user object to the request for later use
          console.log("checking password valid");

          req.user = user;
          next(); // Allow the request to proceed to the login function
        } else {
          // Passwords don't match, return an error response
          console.log("checking password invalid");

          return res.status(400).json({ error: "Invalid password" });
        }
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Email and Password check error:", error);
      res.status(500).json({ error: "Error during email and password check" });
    });
};

exports.LogIn = (req, res) => {
  const user = req.user;
  console.log("in req");

  // Generate a JWT token and send it as a response
  jwt.sign({ user: user }, jwtKey, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      return res.status(500).json({ error: "Error creating token" });
    } else {
      res.status(200).json({ user: user, token: token });
    }
  });
};

exports.getUser = (req, res, next) => {
  const userId = req.body.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        // If the user with the specified ID is not found, send a 404 response
        return res.status(404).json({ error: "User not found" });
      }

      // If the user is found, send the user object as a response
      res.status(200).json(user);
    })
    .catch((error) => {
      // Handle any errors that occur during the database query
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Error retrieving user" });
    });
};
