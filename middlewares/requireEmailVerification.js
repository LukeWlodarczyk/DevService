module.exports = (req, res, next) => {
  if(!req.user.isVerified) {
    res.status(401).json({ message: 'This operation requires verified email'});
  };

  next();
}
