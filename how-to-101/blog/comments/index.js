import express from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] ?? []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const { id } = req.params;
  const comments = commentsByPostId[id] ?? [];
  const status = "pending";
  comments.push({ id: commentId, content, status });
  commentsByPostId[id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { id: commentId, content, postId: id, status },
  });

  res.status(201).send(commentsByPostId);
});

app.post("/events", async (req, res) => {
  console.log("Received event", req.body.type);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id == id);
    comment.status = status;
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: { id, status, postId, content: comment.content },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("listening to 4001");
});
