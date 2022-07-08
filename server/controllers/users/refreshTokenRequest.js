const { checkRefreshToken, generateAccessToken, resendAccessToken } = require('../tokenFunctions');
const { User } = require('../../models');

module.exports = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.json({ data: null, message: 'refresh token not provided' });
  }

  const refreshTokenData = checkRefreshToken(refreshToken);

  if (!refreshTokenData) {
    return res.json({
      data: null,
      message: 'invalid refresh token, please log in again'
    });
  }

  const { id } = refreshTokenData;

  User.findOne({ where: { id } })
    .then((data) => {
      if (!data) {
        return res.json({
          data: null,
          message: 'refresh token has been tempered'
        });
      }

      const newAccessToken = generateAccessToken(data.dataValues);

      const payload = {
        id: data.dataValues.id,
        username: data.dataValues.username,
        token: newAccessToken,
        refreshToken: refreshToken,
        isAdmin: data.dataValues.isAdmin,
        userStatus: 'normal',
        signupDate: String(data.dataValues.createdAt).slice(0, 10),
        dormantDate: null
      };
      resendAccessToken(res, payload);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: 'error' });
    });
};
