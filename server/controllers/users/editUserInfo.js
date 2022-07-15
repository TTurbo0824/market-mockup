const { isAuthorized } = require('../tokenFunctions');
const { User } = require('../../models');
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in." });
    } else {
      const { id } = accessTokenData;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'please enter a password' });
      }

      const salt = crypto.randomBytes(64).toString('hex');
      const encryptedPassword = crypto
        .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
        .toString('base64');

      await User.update(
        {
          salt: salt,
          password: encryptedPassword
        },
        { where: { id } }
      );

      res.status(200).json({ message: 'ok' });
    }
  } catch {
    res.status(400).json({ message: 'error' });
  }
};
