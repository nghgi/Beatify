const song = require("../models/song");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  try {
    const cursor = await song.find({})
      .populate("artistId", "name")
      .populate("albumId", "title")
      .sort({ createdAt: 1 }); // Sử dụng .sort()
    if (cursor && cursor.length > 0) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});

router.get("/getSongbyId/:albumId", async (req, res) => {
  try {
    const songs = await song.find({ albumId: req.params.albumId }).populate("artistId", "name");
    if (songs && songs.length > 0) {
      res.status(200).send({ success: true, data: songs });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server error", error });
  }
});

router.get("/getOne/:getOne", async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await song.findOne(filter)
    .populate("artistId", "name")
    .populate("albumId", "title");

  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

// router.post("/save", async (req, res) => {
//   const newSong = song({
//     title: req.body.title,
//     imageUrl: req.body.imageUrl,
//     songUrl: req.body.songUrl,
//     album: req.body.album,
//     artist: req.body.artist,
//     language: req.body.language,
//     category: req.body.category,
//   });
//   try {
//     const savedSong = await newSong.save();
//     res.status(200).send({ song: savedSong });
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error });
//   }
// });

router.post("/save", async (req, res) => {
  const { title, imageUrl, songUrl, albumId, artistId, language, category } = req.body;

  if (!title || !imageUrl || !songUrl || !artistId || !language || !category) {
    return res.status(400).send({ success: false, msg: "Required fields are missing" });
  }

  try {
    const newSong = new song({
      title,
      imageUrl,
      songUrl,
      albumId,
      artistId,
      language,
      category,
    });

    const savedSong = await newSong.save();
    res.status(200).send({ success: true, song: savedSong });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});


router.put("/update/:updateId", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await song.findOneAndUpdate(
      filter,
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    res.status(200).send({ song: result, msg: "Song changed successfully" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await song.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Song deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Song not found" });
  }
});

router.get("/getFavouritesSongs", async (req, res) => {
  const query = req.query.songId;
  res.send(query);
});

module.exports = router;
