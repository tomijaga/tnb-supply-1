import path from "path";
import express from "express";
import cors from "cors";
import csvWriter from "csv-writer";
import { deployRoute } from "./routes/deploy.js";

const PORT = process.env.PORT || 8080;

const app = express();
// app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/", deployRoute);

const shutDownServer = () => {
  console.log("\nReceived kill signal");
  console.log("Shutting D... o.. w. n");

  process.exit(0);
};

process.on("SIGTERM", shutDownServer);
process.on("SIGINT", shutDownServer);
process.on(
  "uncaughtException",
  (err) => {
    console.log("------Uncaught Exception------");
    console.error(err);
  },
  shutDownServer
);
