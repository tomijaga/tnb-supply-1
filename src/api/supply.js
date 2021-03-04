import path from "path";
import express from "express";
import neatCsv from "neat-csv";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/supply", async (req, res, next) => {
  res.json({});
  console.log("Build served");
});

export { router as deployRoute };
