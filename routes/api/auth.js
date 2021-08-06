const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

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


module.exports = router; 