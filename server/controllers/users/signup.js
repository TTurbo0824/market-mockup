const crypto = require('crypto');
const { User } = require('../../models');

module.exports = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    // 회원가입 양식을 다 채우지 않은 경우
    if (!username || !password) {
      return res.status(417).json({ message: 'please fill in all the required fields' });
    }

    // 유저네임이 중복인 경우
    const dplctUsername = await User.findAll({
      where: {
        username: username
      }
    });

    if (dplctUsername.length !== 0) {
      return res.status(409).json({ message: 'conflict: username' });
    } else {
      const salt = crypto.randomBytes(64).toString('hex');
      const encryptedPassword = crypto
        .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
        .toString('base64');

      await User.create({
        username: username,
        name: name,
        password: encryptedPassword,
        salt: salt,
        isAdmin: false,
        status: 'normal'
      });

      res.status(201).json({ message: 'thank you for signing up!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
