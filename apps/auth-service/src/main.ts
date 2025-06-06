import express from "express";
import cors from "cors";
import { errormiddleware } from "@packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import swaggerUi from "swagger-ui-express"
const swaggerDocument = require("./swagger-output.json")

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

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.get("/docs-json",(req,res)=>{
  res.json(swaggerDocument);
})

// routes
app.use("/api",router);

const port = process.env.PORT || 6001;

console.log("starting Auth-service")
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  console.log(`Swagger docs avaiable at http://localhost:${port}/docs`)
});

server.on("error", (err) => {
  console.log("server error", err);
});
