const express = require("express");
const { PostModel } = require("../model/post.model");
const { auth } = require("../middlewares/auth.middlewares");

const PostRouter = express.Router();

PostRouter.use(auth);

//get posts
PostRouter.get("/", async (req, res) => {
  const { min, max } = req.query;
  const payload = req.body;
  if (min === undefined) min = 0;
  if (max === undefined) max = 100;
  try {
    const posts = await PostModel.find({
      userId: payload.userId,
      no_of_comments: { $lte: max, $gte: min },
    }).limit(3);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// top comment
PostRouter.get("/top", async (req, res) => {
  const payload = req.body;
  try {
    const posts = await PostModel.aggregate([
      { $match: { userId: payload.userId } },
      { $sort: { no_of_comments: -1 } },
      { $limit: 1 },
    ]);
    res.status(200).json({ post: posts[0] });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/// post request
PostRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.status(200).json({ msg: "Post Created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//patch request
PostRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const postid = req.params.id;
  try {
    const post = await PostModel.findOne({ _id: postid });
    if (post) {
      if (post.userId === payload.userId) {
        await PostModel.findOneAndUpdate({ _id: postid }, payload);
        res.status(200).json({ msg: "Post Updated" });
      } else {
        res.status(400).json({ msg: "You are not authorized" });
      }
    } else {
      res.status(400).json({ msg: "Invalid Post" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Delete Post
PostRouter.delete("/delete/:id", async (req, res) => {
  const payload = req.body;
  const postid = req.params.id;
  try {
    const post = await PostModel.findOne({ _id: postid });
    if (post) {
      if (post.userId === payload.userId) {
        await PostModel.findOneAndDelete({ _id: postid });
        res.status(200).json({ msg: "Post Deleted" });
      } else {
        res.status(400).json({ msg: "You are not authorized" });
      }
    } else {
      res.status(400).json({ msg: "Invalid Post" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = { PostRouter };
