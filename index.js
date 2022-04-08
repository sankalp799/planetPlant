const http = require("http");
const express = require("express");
const path = require("path");
const config = require("./config");
const fs = require("fs");
const axios = require("axios");
const parser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const handler = require("./lib/handler");

let app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "template"));

app.use(parser.json({ limit: "200mb" }));
app.use(parser.urlencoded({ extended: true, limit: "200mb" }));
app.use("/p", express.static(path.join(__dirname, "public")));

app.get("/favicon.ico", handler.favicon);
app.post(
  "/api/v1/identify",
  handler.middleware.INIT_API_AUTH,
  handler.api.identity
);
app.get("/", handler.index);

http
  .createServer(app)
  .listen(PORT, (ERR) =>
    console.log(!ERR ? `listening on port: ${PORT}` : `ERROR> ${ERR.message}`)
  );
