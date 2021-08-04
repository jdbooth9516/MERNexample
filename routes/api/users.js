const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require('gravatar');
const {body, validationResult} = require("express-validator");

const User = require('../../models/User');


// Route: POST api/users
//DESC: Register User
//ACCESS: Public
router.post('/', [
    
    // this is the validation. 
    body("name", 'Name is required').not().isEmpty(),
    body('email', "Please include a valid email").isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({min:6})

],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
        return res.status(400).json({errors: errors.array()})
    }

    // destructer the req.body. 
    const { name, email, password} = req.body;

    try  { 
        // checks to see if the user already exsists
        let user = await User.findOne({email})
        if(user) { 
            res.status(400).json({errors: [{msg: 'User already exists'}]})
        }
        // config for the avatar. 
        const avatar  = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d:'mm'
        })
        // sets the user object to get sent to the database.
        user = new User({
            name, 
            email, 
            avatar, 
            password
        })

        // encrypting the password 

        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(password, salt);

        //save the user to the database. 
        await user.save();

        // Need to return the JWT Here

        res.send(`User ${user}`)
    } catch (error) {
        console.error(error.message)

    }

   
});


module.exports = router;   