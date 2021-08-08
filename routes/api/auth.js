const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const config = require('config');
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User")


// Route: GET api/auth
//DESC: test route
//ACCESS: Public
router.get('/', auth, async(req, res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        //This is what actually sends the information to be seen. 
        res.json(user);

    } catch (error) {
        console.log(error.message);
    }
    }
);

// Route: POST api/auth
//DESC: login route
//ACCESS: auth
router.post('/', [
    
    // this is the validation. 
    body('email', "Please include a valid email").isEmail(),
    body('password', "Password is required").exists()

],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
        return res.status(400).json({errors: errors.array()})
    }

    // destructer the req.body. 
    const { email, password} = req.body;

    try  { 
        // checks to see if the user already exsists
        let user = await User.findOne({email})
        if(!user) { 
             return res.status(400).json({errors: [{msg: 'Invaild Credentials'}]})
        }

        // verify that the passwords match
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            //use the same message here for security reasons.
            return res.status(400).json({ errors: [{ msg: 'Invaild Credentials' }] });
        }

        // this is the information that will get sent with the token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message)

    }

   
});


module.exports = router; 