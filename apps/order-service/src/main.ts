
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import { errormiddleware } from '@packages/error-handler/error-middleware';
import router from './routes/order.route';
import { createOrder } from './controllers/order.controller';



const app = express();
app.use(
  cors({
    origin:["http://localhost:3000"],
    allowedHeaders:["Authorization","Content-Type"],
    credentials:true 
  })
)
// it is for stripe ***
app.post(
  "/api/create-order",
  bodyParser.raw({ type: "application/json"}),
  (req,res,next) =>{
    (req as any).rawBody  =req.body;
    next();
  },
  createOrder
)

app.use(express.json());
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send({ message: 'Welcome to order-service!' });
});

const port = process.env.PORT || 6004;

app.use("/api",router)

app.use(errormiddleware)
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
