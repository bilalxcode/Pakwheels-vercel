exports.adminLogin = (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.pass;

  res.status(200).json({ message: "success" });
};
