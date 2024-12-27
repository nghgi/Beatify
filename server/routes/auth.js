const admin = require('../config/firebase.config');
const user = require('../models/user');
// const song = require('../models/song');

const router = require('express').Router();

router.get('/login', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: 'Invalid Token' });
  }

  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(500).json({ message: 'Unauthorized' });
    }
    // Check if the user exists
    const userExists = await user.findOne({ user_id: decodeValue.user_id });
    if (!userExists) {
      newUserData(decodeValue, req, res);
    } else {
      // Check the user's status
      if (userExists.status === 'banned') {
        return res.status(403).json({ message: 'Your account has been banned. Please contact the admin for futher support.' });
      }
      // Update user data if not banned
      updateUserData(decodeValue, req, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});


router.put('/favourites/:userId', async (req, res) => {
  const filter = { _id: req.params.userId };
  const songId = req.query;

  try {
    console.log(filter, songId);
    const result = await user.updateOne(filter, {
      $push: { favourites: songId },
    });
    res.status(200).send({ success: true, msg: 'Song added to favourites' });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get('/getUsers', async (req, res) => {
try {
    const cursor = await user.find({}).sort({ createdAt: 1 }); // Sử dụng .sort()
    if (cursor && cursor.length > 0) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});

router.get('/getUser/:userId', async (req, res) => {
  const filter = { _id: req.params.userId };

  const userExists = await user.findOne({ _id: filter });
  if (!userExists)
    return res.status(400).send({ success: false, msg: 'Invalid User ID' });
  if (userExists.favourites) {
    res.status(200).send({ success: true, data: userExists });
  } else {
    res.status(200).send({ success: false, data: null });
  }
});

router.put('/updateRole/:userId', async (req, res) => {
  console.log(req.body.data.role, req.params.userId);
  const filter = { _id: req.params.userId };
  const role = req.body.data.role;

  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findOneAndUpdate(filter, { role: role }, options);
    res.status(200).send({ user: result });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
});

router.delete('/delete/:userId', async (req, res) => {
  const filter = { _id: req.params.userId };

  const result = await user.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: 'Data Deleted' });
  } else {
    res.status(200).send({ success: false, msg: 'Data Not Found' });
  }
});

router.put('/removeFavourites/:userId', async (req, res) => {
  const filter = { _id: req.params.userId };
  const songId = req.query;

  try {
    console.log(filter, songId);
    const result = await user.updateOne(filter, {
      $pull: { favourites: songId },
    });
    res
      .status(200)
      .send({ success: true, msg: 'Song removed from favourites' });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put('/update/:updateId', async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await user.findOneAndUpdate(
      filter,
      {
        username: req.body.username,
        imageURL: req.body.imageURL,
      },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

const newUserData = async (decodeValue, req, res) => {
  const newUser = new user({
    username: decodeValue.name,
    email: decodeValue.email,
    status: 'active',
    imageURL: decodeValue.picture,
    user_id: decodeValue.user_id,
    email_verfied: decodeValue.email_verified,
    role: 'member',
    auth_time: decodeValue.auth_time,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({ user: savedUser });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
};

const updateUserData = async (decodeValue, req, res) => {
  const filter = { user_id: decodeValue.user_id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await user.findOneAndUpdate(
      filter,
      { auth_time: decodeValue.auth_time },
      options
    );
    res.status(200).send({ user: result });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
};

module.exports = router;
