const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const payload = {
      id: accessTokenData.id,
      username: accessTokenData.username,
      token: token,
      isAdmin: accessTokenData.isAdmin,
      userStatus: 'normal',
      signupDate: accessTokenData.createdAt.slice(0, 10),
      dormantDate: null
    };

    return res.status(200).json({
      data: payload,
      message: 'logged in successfully'
    });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
