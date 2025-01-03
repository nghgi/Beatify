const artist = require("../models/artist");
const song = require("../models/song");
const album = require("../models/album");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  try {
    const cursor = await artist.find({}).sort({ createdAt: 1 }); // Sử dụng .sort()
    if (cursor && cursor.length > 0) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});


router.get("/getOne/:getOne", async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await artist.findOne(filter);

  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No data Found" });
  }
});

router.post("/save", async (req, res) => {
  const newArtist = artist({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
  });
  try {
    const savedArtist = await newArtist.save();
    res.status(200).send({ success: true, artist: savedArtist });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.put("/update/:updateId", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await artist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

// router.delete("/delete/:deleteId", async (req, res) => {
//   const filter = { _id: req.params.deleteId };

//   const result = await artist.deleteOne(filter);
//   if (result.deletedCount === 1) {
//     res.status(200).send({ success: true, msg: "Data Deleted" });
//   } else {
//     res.status(200).send({ success: false, msg: "Data Not Found" });
//   }
// });

router.delete("/delete/:deleteId", async (req, res) => {
  const artistId = req.params.deleteId;
  const filter = { _id: artistId };

  try {
    await song.deleteMany({ artistId });
    await album.deleteMany({ artistId });
    const result = await artist.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Artist and related data deleted" });
    } else {
      res.status(404).send({ success: false, msg: "Artist not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});

module.exports = router;
