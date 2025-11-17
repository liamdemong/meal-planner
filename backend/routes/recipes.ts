import * as express from "express";
const router: express.Router = express.Router();

router.get("/search", (req, res) => {
  res.json({ message: "Search recipe placeholder" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Recipe details placeholder ${req.params.id}` });
});

export default router;
