const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Configure ENV variables
dotenv.config();

// Parse Incoming Request Body
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Handling CORS errors on client-side
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({
      message: "Server is CORS enabled",
    });
  }
  next();
});

// Bind Neo4j in every request
app.use((req, res, next) => {
  req.neo4j = require("./neo4j");
  next();
});

// Sample Neo4j Calls - Return Number of Nodes
app.get("/total_num_nodes", async function (req, res, next) {
  req.neo4j
    .read("MATCH (n) RETURN count(n) AS count")
    .then((result) => result.records[0].get("count").toNumber())
    .then((count) =>
      res.status(200).json({
        status: "OK",
        count: count,
      })
    )
    .catch((err) => console.log(err));
  // console.log(result);
});

// Add Routes
app.use(require("./routes"));

// Sample Neo4j Calls - Get All Volunteer Data
app.get("/volunteers", (req, res, next) => {
  req.neo4j
    .read("MATCH (v:Volunteer) RETURN v {.firstName, .about} as details")
    .then((result) => result.records.map((row) => row.get("details")))
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
});

// Handle default route
app.use("/", (req, res, next) => {
  res.status(200).json({
    message: "Server is running!",
  });
});

// Error Handling
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
