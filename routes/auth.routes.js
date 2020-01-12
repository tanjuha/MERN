const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect password, must be at least 6 characters')
     .isLength({min: 6})
  ],
  async (req, res) => {
  try {
    // check if email and password valid
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data!'
      })
    }

    const { email, password} = req.body;

    const candidate = await User.findOne({ email });

    // check if user exists
    if(candidate) {
      return res.status(400).json({ message: 'Such user already exists!'});
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user
    const user = new User({ email, password: hashedPassword});

    await user.save();
    
    res.status(201).json({ message: 'User created!'});


  } catch(e) {
    res.status(500).json({ message: 'Something is wrong, try again!'});
  }
});

router.post(
  '/login',
  [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Incorrect password, must be at least 6 characters')
    .exists()
  ],
   async (req, res) => {
  try {
    // check if email and password valid
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data!'
      })
    }

    const { email, password } = req.body;

     // check if user exists
     const user = await User.findOne({ email });

     if(!user) {
       return res.status(400).json({ message: 'User not found!'})
     }

    // check if password the same
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({message: 'Incorrect password, try again'})
    }

    // generate jwt
    const token = jwt.sign(
      {userId: user.id}, // data will be crypt
      config.get('jwtSecret'), // generate secret key
      { expiresIn: '1h'} // when token die
    )

    res.json({token, userId: user.id});


  } catch(e) {
    res.status(500).json({ message: 'Something is wrong, try again!'});
  }
})

module.exports = router;