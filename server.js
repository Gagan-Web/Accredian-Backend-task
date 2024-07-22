import "dotenv/config";
import express from "express";
import cors from 'cors'
// import { createRefer } from "./controllers/refferalcontroller.js";
// import Errorhandler from "../utils/errorhandeler.js";
// import errormiddleware from "./middleware/error.js"
// import { createRefer } from ".//Refer.js";

const app = express();

app.use(cors())

// prisma.$on("connect", () => {
//   console.log("connection to db successful");
// });

console.log(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3000;
// main()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send("hii Everyone");
});

//routes files
import routes from "./routes/index.js";
import Errorhandler from "./utils/errorhandeler.js";
app.use(routes);
// app.use(errormiddleware)
// app.post("/refer-form-submit", (req, res, next) => {
//import controller

// check for the correct data and validation

// /if data is correct store the data to the DB using model
// createRefer(res.body, function (err) {
// if (err) {
  // return console.log("this is wrong");
// } ; //handel error

// res.json(createdData);
// });

//send the respose to show the success msg/like {fromSubmitedDB : true}
// });

app.listen(PORT, () => console.log(`server is runing on PORT ${PORT}`));
