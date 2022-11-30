import express from "express";

const router = express.Router();

router.post("/users/signout", (req, res) => {
  res.send("Hi There");
});

export { router as signoutRouter };
