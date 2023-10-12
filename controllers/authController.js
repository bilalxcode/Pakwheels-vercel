//imports
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

//keys
const jwtKey = "wheels_pak";

//transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "supremebilal78@gmail.com",
    pass: "xlifiuqjtmrigppl",
  },
});

//controllers
let verificationToken;

exports.sendEmailVerification = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const min = 100000;
  const max = 999999;
  verificationToken = Math.floor(Math.random() * (max - min + 1)) + min;
  const mailOptions = {
    from: "pakwheels.com",
    to: email,
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
  try {
    const user = await User.findOne({ verificationToken: sixDigitToken });

    if (!user) {
      console.log("invalid token");
      return res.status(400).json({ error: "Invalid token." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user
      .save()
      .then(() => {
        jwt.sign(
          { message: "SignUp Successful" },
          jwtKey,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              return res.json({ error: "Error creating token" });
            } else {
              res.json({ user: user, jwttoken: token });
            }
          }
        );
      })
      .catch((error) => {
        console.error("Error adding new User:", error);
        res.json({ error: "Error adding new User" });
      });
  } catch (error) {
    console.error("Verification error:", error);

    return res
      .status(500)
      .json({ message: "An error occurred during verification." });
  }
};

exports.isNewUser = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(400).json({ error: "Email already taken" });
    }
    next();
  });
};

exports.isPasswordValid = (req, res, next) => {
  const password = req.body.password;

  const minLengthRegex = /^.{8,}$/;
  const capitalLetterRegex = /[A-Z]/;
  const specialCharacterPattern = "[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-=|\\\\/]";
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
        return res
          .status(200)
          .json({ message: "User signup without verified false" });
      })
      .catch((error) => {
        console.error("Error adding new User:", error);
        res.json({ error: "Error adding new User" });
      });
  });
};

//to invalidate token
const blacklist = new Set();

//controllers
exports.SignOut = (req, res, next) => {
  const token = req.body.token;

  blacklist.add(token);

  res.status(200).json({ message: "Token invalidated successfully" });
};

exports.checkEmailAndPassword = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Email not found" });
      }
      if (user.isBanned) {
        return res.status(400).json({ error: "User is banned" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ error: "Error comparing passwords" });
        }

        if (result) {
          req.user = user;
          next();
        } else {
          return res.status(400).json({ error: "Invalid password" });
        }
      });
    })
    .catch((error) => {
      console.error("Email and Password check error:", error);
      res.status(500).json({ error: "Error during email and password check" });
    });
};

exports.LogIn = (req, res) => {
  const user = req.user;
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
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    })
    .catch((error) => {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Error retrieving user" });
    });
};

exports.saveGoogleUser = (req, res) => {
  const userEmail = req.body.userEmail;
  const userName = req.body.userName;

  User.findOne({ email: userEmail }).then((user) => {
    if (user) {
      if (user.isBanned) {
        console.log("User is banned");
        return res
          .status(401)
          .json({ error: "User is banned", message: "You are banned" });
      }
      jwt.sign({ user: user }, jwtKey, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          return res.status(500).json({ error: "Error creating token" });
        } else {
          res.status(200).json({ user: user, token: token });
        }
      });
    } else {
      const newUser = new User({
        name: userName,
        email: userEmail,
        isVerified: true,
      });
      newUser
        .save()
        .then(() => {
          User.findOne({ email: userEmail }).then((user) => {
            if (user) {
              jwt.sign(
                { user: user },
                jwtKey,
                { expiresIn: "1h" },
                (err, token) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Error creating token" });
                  } else {
                    res.status(200).json({ user: user, token: token });
                  }
                }
              );
            }
          });
        })
        .catch((error) => {
          console.error("Error adding new User:", error);
          res.json({ error: "Error adding new User" });
        });
    }
  });
};

function generateVerificationCode() {
  const min = 100000;
  const max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

exports.resetPassword = async (req, res, next) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verificationCode = generateVerificationCode();

    user.verificationToken = verificationCode;
    await user.save();

    const mailOptions = {
      from: "pakwheels.com",
      to: userEmail,
      subject: "Reset Password Verification",
      text: `Your verification code to reset your password is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        return res
          .status(500)
          .json({ error: "Error sending verification email" });
      } else {
        console.log("Verification email sent:", info.response);
        res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
};

exports.validateResetPassword = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.verificationToken !== verificationCode) {
      return res
        .status(400)
        .json({ error: "Invalid email or verification code" });
    }

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error validating reset password:", error);
    return res.status(500).json({ error: "Error validating reset password" });
  }
};

exports.finalResetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Error hashing password" });
      }

      user.password = hashedPassword;
      user.verificationToken = null;
      await user.save();

      return res.status(200).json({ message: "Password Updated" });
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Error updating password" });
  }
};
