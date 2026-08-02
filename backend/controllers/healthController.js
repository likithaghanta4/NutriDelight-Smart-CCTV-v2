const getHealth = (req, res) => {
  res.status(200).json({
    status: "Backend Running",
  });
};

module.exports = {
  getHealth,
};
