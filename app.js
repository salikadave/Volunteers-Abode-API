const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");

// import routes here
// const neo4j_calls = require("./db-init");

// Configure ENV variables
dotenv.config();

// Establish Connection with Mongo DB
// mongoose
//   .connect(process.env.MONGO_ATLAS_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   })
//   .then((result) => {
//     console.log("Database connected!");
//   })
//   .catch((err) => console.log(err));

// Parse Incoming Request Body
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Handle Social Worker & Admin Routes

// app.use("/socialWorker", productRoutes);
// app.use("/ngoAdmin", orderRoutes);

// require("./models/user");
// require("./models/post");
// const checkAuth = require("./middleware/checkAuth");

// app.use(require("./routes/auth"));
// app.use(require("./routes/post"));
// app.get("/", checkAuth, (req, res) => {
//   res.send({ userName: req.user.userName });
// });

app.use((req, res, next) => {
  req.neo4j = require("./db-init");
  next();
});

// Sample Neo4j Calls
app.get("/neo4j_get", async function (req, res, next) {
  req.neo4j
    .read("MATCH (n) RETURN count(n) AS count")
    .then((result) => result.records[0].get("count").toNumber())
    .then((count) =>
      res.json({
        status: "OK",
        count: count,
      })
    )
    .catch((err) => console.log(err));
  // console.log(result);
});

// Get All Volunteer Data
app.get("/volunteers", (req, res, next) => {
  req.neo4j
    .read("MATCH (v:Volunteer) RETURN v {.firstName, .about} as details")
    .then((result) => result.records.map((row) => row.get("details")))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

// Handle default route

app.use("/", (req, res, next) => {
  res.status(200).json({
    message: "Server is running!",
  });
});

// Handle error

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  res.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status = error.status || 500;
  res.json({
    error: {
      message: error.message,
    },
  });
});

// exports.router = router;
module.exports = app;
