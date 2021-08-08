const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

// Route: GET api/profile/me
//DESC: Get a single user profile
//ACCESS: Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
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
router.post(
  '/',
  [
    auth,
    body('status', 'Status is required').not().isEmpty(),
    body('skills', 'Skills is required').not().isEmpty(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      linkedin,
      twitter,
      instagram,
      facebook,
    } = req.body;

    // building the profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.compnay = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      // the .trim() here will trim of the white space.
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    // we have to initialize the objects before we can check for them.
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // this is were we are finding the right user to add the profile to
      let profile = await Profile.findOne({ user: req.user.id });

      //update if there is already a profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: ProfileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
