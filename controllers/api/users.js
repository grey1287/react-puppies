const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  create,
  login,
  checkToken,
};

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    
    res.json(token)
  } catch (error) {
    
    res.status(400).json(error);
  }
};

// jwt helper function
function createJWT(user) {
  return jwt.sign(
    { user },
    process.env.SECRET,
    { expiresIn: '24h'}
  );
};

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const token = createJWT(user);
      res.json(token);
    } else {
      throw new Error();
    }
  } catch {
    res.status(400).json('Bad Credentials');
  }
}

function checkToken(req, res) {
  console.log('req.user', req.user);
  res.json(req.exp);
}