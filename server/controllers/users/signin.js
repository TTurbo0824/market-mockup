const crypto = require('crypto');
const { User } = require('../../models');
const { generateAccessToken, generateRefreshToken } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 로그인 양식을 다 채우지 않은 경우
    if (!username || !password) {
      return res.status(417).json({ message: 'please fill in all the required fields' });
    }

    // 가입된 유저인지 확인
    const member = await User.findOne({
      where: { username: username }
    });

    if (!member) {
      return res.status(404).json({ message: 'Invalid user' });
    } else {
      const dbPassword = member.password;
      const salt = member.salt;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
        .toString('base64');

      // 비밀번호가 틀렸을 경우
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

        return res.status(200).json({
          accessToken,
          refreshToken,
          message: 'logged in successfully'
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};
