const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/Users');
const router = express.Router();

router.post('/createuser', [
  body('name', 'Enter a valod name').isLength({ min: 3 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 charcters').isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {


      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "sorry user already exsits with email" })
      }
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
      })
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
    //.then(User => res.json(User))
    //.catch(err =>{ console.log(err);
    // res.json({errors: "please enter a valid email address"})
  })

module.exports = router