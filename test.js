const imageToBase64 = require("image-to-base64");
const raw_image = require("./image.json").base64image;
//or
//import imageToBase64 from 'image-to-base64/browser';

const base64Converter = (image) => {
  try {
    return imageToBase64(image);
  } catch (e) {
    console.log(e.message);
  }
};

base64Converter(raw_image)
  .then((response) => console.log(response))
  .catch((er) => console.error(er));
