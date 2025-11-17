import * as express from "express";
const router: express.Router = express.Router();

router.get("/", (req, res) => res.json({ message: "Get weekly meal plan" }));
router.post("/", (req, res) => res.json({ message: "Add to meal plan" }));
router.put("/:day", (req, res) => res.json({ message: "Update meal" }));
router.delete("/:day", (req, res) => res.json({ message: "Delete meal" }));

export default router;
