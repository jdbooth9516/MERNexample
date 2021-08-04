const express = require('express')
const router = express.Router()


// Route: GET api/auth
//DESC: test route
//ACCESS: Public
router.get('/', (req, res) => res.send('Auth Route'));


module.exports = router; 