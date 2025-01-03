const album = require("../models/album");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
  try {
    const cursor = await album.find({}).sort({ createdAt: 1 }); // Sử dụng .sort()
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

  const cursor = await album.findOne(filter);
  console.log(cursor);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
});

router.post("/save", async (req, res) => {
  const newAlbum = album({
    title: req.body.title,
    artistName: req.body.artistName,
    imageUrl: req.body.imageUrl,
  });
  try {
    const savedAlbum = await newAlbum.save();
    res.status(200).send({ album: savedAlbum });
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

router.delete("/delete/:deleteId", async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await album.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
});

module.exports = router;
