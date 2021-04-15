// const express = require("express");
// const myApp = require("./app");


// const PORT = process.env.PORT || 5000;
// const app = express();
// const server = app.listen(PORT, function () {
//   console.log(`Listening on port ${PORT}`);
//   console.log(`http://localhost:${PORT}`);
// });

// app.get("/")

const http = require("http");
const port = process.env.PORT || 4000;
const app = require("./app");

const server = http.createServer(app);

server.listen(port);
console.log("Server running at port", port);

