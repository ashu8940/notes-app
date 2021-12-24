const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/Users');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');

const JWT_SCREAT='ashuisagoodb$oy'


router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
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
  const salt= await bcrypt.genSalt(10);
 const secpass=await bcrypt.hash(req.body.password, salt);
      // create User
      user = await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email
      })
const data={user:{
  id:user.id,
}
}
  const authToken =  jwt.sign(data,JWT_SCREAT);

      res.json({authToken:authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
    
  })
  router.post('/login', [
   
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
 const {email, password} = req.body;
try{
  let user= User.findOne({ email: email})
  if (!user){
    return res.status(400).json({ error: " invalid credentials " })
  }
}catch(err){

}
    })

module.exports = router