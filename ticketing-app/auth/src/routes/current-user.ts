import express from "express";

const router = express.Router();

router.get("/users/currentuser", (req, res) => {
  res.send("Hi There");
});

export { router as currentUserRouter };
