const album = require("../models/album");
const song = require("../models/song");
const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  try {
    const cursor = await album.find({}).populate("artistId", "name").sort({ createdAt: 1 }); // Sử dụng .sort()
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

  const cursor = await album.findOne(filter).populate("artistId", "name");
  console.log(cursor);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

// router.post("/save", async (req, res) => {
//   const newAlbum = album({
//     title: req.body.title,
//     artistName: req.body.artistName,
//     imageUrl: req.body.imageUrl,
//   });
//   try {
//     const savedAlbum = await newAlbum.save();
//     res.status(200).send({ album: savedAlbum });
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error });
//   }
// });

router.post("/save", async (req, res) => {
  const { title, artistId, imageUrl } = req.body;

  if (!title || !artistId || !imageUrl) {
    return res.status(400).send({ success: false, msg: "Required fields are missing" });
  }

  try {
    const newAlbum = new album({
      title,
      artistId,
      imageUrl,
    });

    const savedAlbum = await newAlbum.save();
    res.status(200).send({ success: true, album: savedAlbum });
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
    const result = await album.findOneAndUpdate(
      filter,
      {
        title: req.body.title,
        artistName: req.body.artistName,
        imageUrl: req.body.imageUrl,
      },
      options
    );
    res.status(200).send({ album: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

// router.delete("/delete/:deleteId", async (req, res) => {
//   const filter = { _id: req.params.deleteId };

//   const result = await album.deleteOne(filter);
//   if (result.deletedCount === 1) {
//     res.status(200).send({ success: true, msg: "Data Deleted" });
//   } else {
//     res.status(200).send({ success: false, msg: "Data Not Found" });
//   }
// });

router.delete("/delete/:albumId", async (req, res) => {
  const albumId = req.params.albumId;
  const filter = { _id: albumId };

  try {
    await song.deleteMany({ albumId });

    // Xóa Album
    const result = await album.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Album and related songs deleted" });
    } else {
      res.status(404).send({ success: false, msg: "Album not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});


router.get("/getByArtist/:artistId", async (req, res) => {
  const { artistId } = req.params;

  try {
    const albums = await album.find({ artistId }).populate("artistId", "name");

    if (albums.length > 0) {
      res.status(200).send({ success: true, data: albums });
    } else {
      res.status(404).send({ success: false, msg: "No albums found for this artist" });
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server Error", error });
  }
});

module.exports = router;
