const config = require("../config");
const fs = require("fs");
const path = require("path");
let api = {};
let middleware = {};
const axios = require("axios");

middleware.INIT_API_AUTH = (req, res, next) => {
  console.log("request_header> ", req.headers);
  const req_secret = req.headers["authorization"] == process.env.SECRET;
  console.log(req_secret);
  if (req_secret) next();
  else
    res.status(403).json({
      ok: false,
      status: 403,
      error: "Unauthorized access \n invalid token",
    });
};

api.identity = (request, response) => {
  const image64base = request.body["base64string"];
  console.log("request_body> ", request.body);

  if (typeof image64base !== "string") {
    response
      .status(400)
      .json({ ok: false, status: 400, error: "Invalid base64 string" });
    return;
  }

  let req_data = config.api_req_data;
  req_data.api_key = process.env.API_KEY;
  req_data.images = [];
  req_data.images.push(image64base);

  axios
    .post("https://api.plant.id/v2/identify", req_data)
    .then((res) => {
      console.log("Success>", res);
      response.status(200).json({ ok: true, status: 200, data: res.data });
    })
    .catch((error) => {
      console.error("Error> ", error);
      response
        .status(400)
        .json({ ok: false, status: 400, error: error.message });
    });
};

module.exports = {
  index: (req, res) => {
    res.render("main", config["static"]);
  },

  favicon: (req, res) => {
    res.writeHead(200, { contentType: "image/x-icon" });
    fs.createReadStream(path.join(__dirname, "../public/favicon.ico")).pipe(
      res
    );
  },
  api,
  middleware,
};
