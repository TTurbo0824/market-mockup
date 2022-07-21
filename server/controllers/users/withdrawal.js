const { User } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    const { id } = accessTokenData;

    await User.destroy({
      where: { id }
    });

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
