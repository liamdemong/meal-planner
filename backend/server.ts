import express, { Application } from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes";
import mealplanRouter from "./routes/mealplan";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Health check
app.get(["/health", "/api/health"], (_req, res) => {
	res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/recipes", recipesRouter);
app.use("/api/mealplan", mealplanRouter);

// Start server (default port aligns with nginx proxy and local dev)
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`API server listening on http://localhost:${PORT}`);
});

export default app;
