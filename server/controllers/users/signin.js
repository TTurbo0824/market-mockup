const crypto = require('crypto');
const { User } = require('../../models');
const { generateAccessToken, generateRefreshToken } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const { username, password, type } = req.body;

    if (!username || !password) {
      return res.status(417).json({ message: 'please fill in all the required fields' });
    }

    const member = await User.findOne({
      where: { username: username }
    });

    if (!member) {
      return res.status(404).json({ message: 'Invalid user' });
    } else if (type === 'user' && member.isAdmin) {
      res.status(401).json({ message: 'not a normal user' });
    } else if (type === 'admin' && !member.isAdmin) {
      res.status(401).json({ message: 'not an administrator' });
    } else {
      const dbPassword = member.password;
      const salt = member.salt;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
        .toString('base64');

      if (hashedPassword !== dbPassword) {
        return res.status(400).json({ message: 'please check your password and try again' });
      } else {
        const accessToken = generateAccessToken(member.dataValues);
        const refreshToken = generateRefreshToken(member.dataValues);
        const cookieOptions = {
          httpOnly: true,
          sameSite: 'None'
        };

        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        const payload = {
          id: member.id,
          username: member.username,
          token: accessToken,
          refreshToken: refreshToken,
          isAdmin: member.isAdmin,
          userStatus: member.status,
          signupDate: String(member.createdAt).slice(0, 10),
          dormantDate: member.dormantDate
        };

        return res.status(200).json({
          accessToken,
          refreshToken,
          userInfo: payload,
          message: 'logged in successfully'
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
