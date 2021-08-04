const express = require('express')
const router = express.Router()


// Route: GET api/profile
//DESC: test route
//ACCESS: Public
router.get('/', (req, res) => res.send('Profile Route'));


module.exports = router; 