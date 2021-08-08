const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require("../../models/Profile")
const { body, validationResult } = require('express-validator');

const User = require('../../models/User')

// Route: GET api/profile/me
//DESC: Get a single user profile 
//ACCESS: Private 
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.send(500);
  }
});

// Route: POST api/profile/
//DESC: Create or update user profile 
//ACCESS: Private 
router.pst('/', [auth,
  body('status', "Status is required").not().isEmpty(),
  body('skills', 'Skills is required').not().isEmptry()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
  
} )

module.exports = router; 