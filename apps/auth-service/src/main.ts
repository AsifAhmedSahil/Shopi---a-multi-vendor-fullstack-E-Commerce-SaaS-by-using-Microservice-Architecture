import express from "express";
import cors from "cors";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

const myPort = process.env.PORT || 6001;
const server = app.listen(myPort, () => {
  console.log(`Listening on port: ${myPort}`);
});

server.on("error", (err) => {
  console.log("server error", err);
});
