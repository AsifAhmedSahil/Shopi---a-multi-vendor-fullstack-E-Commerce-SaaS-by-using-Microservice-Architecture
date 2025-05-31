import express from "express";
import cors from "cors";
import { errormiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(errormiddleware);

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

server.on("error", (err) => {
  console.log("server error", err);
});
