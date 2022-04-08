const ajaxRequester = (path, options) => {
  const _sec_ = document.getElementById("xx-ccx-xx").innerText;
  console.log(_sec_);
  options["headers"]["auth"] = _sec_;
  console.log(options);
  return fetch(path, options);
};

const xhrHttpRequester = (headers, path, method, payload, callback) => {
  headers = typeof headers == "object" && headers !== null ? headers : {};
  path = typeof path == "string" ? path : "/";
  method =
    typeof method == "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(method.toUpperCase()) > -1
      ? method
      : "GET";
  payload = typeof payload == "object" && payload !== null ? payload : {};
  callback = typeof callback == "function" ? callback : {};

  let xhr = new XMLHttpRequest();
  xhr.open(method, path, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  // add user header to AJAX REQUEST
  for (let header in headers) {
    if (headers.hasOwnProperty(header)) {
      xhr.setRequestHeader(header, headers[header]);
    }
  }

  // set user config token to xml request headers
  /*
    if(app.config.sessionToken){
        xhr.setRequestHeader('token', app.config.sessionToken.id);
    }
    */

  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let statusCode = xhr.status;
      let responseText = xhr.responseText;

      if (callback) {
        try {
          responseText = JSON.parse(responseText);
          // console.log(responseText);
          callback(statusCode, responseText);
        } catch (e) {
          callback(statusCode, false);
        }
      }
    }
  };

  let payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};

const xx_err_show_resume = (e = Error) => {
  console.log(e);
};

(() => {
  const loader = document.getElementById("cssLoader");
  const plantBtn = document.getElementById("plantButton");
  const plantInput = document.getElementById("plantInput");
  let base64String = "";
  let reader = new FileReader();

  reader.onloadend = function () {
    base64String = reader.result;
    console.log(reader.result);
  };

  plantInput.onchange = function () {
    reader.readAsDataURL(plantInput.files[0]);
  };

  plantBtn.onclick = function () {
    loader.removeAttribute("hidden");
    /*
        ajaxRequester('/api/v1/identify', {
            method: 'POST',
            headers: {'accept': 'application/json'},
            body: {
                base64String
            }
        }).then(res => {
            console.log(res);
            format_data(res['data']);
        })
        .catch(err => {
            console.error(err);
        })
        */

    xhrHttpRequester(
      {
        authorization: document
          .getElementById("xx-ccx-xx")
          .innerText.toString(),
      },
      `${window.location.origin}/api/v1/identify`,
      "POST",
      { base64string: base64String },
      (_s, _rp) => {
        _rp
          ? format_data(_rp["data"])
          : xx_err_show_resume(new Error(_rp["error"]));
      }
    );
  };
})();

function format_data(data) {
  let plant = data["suggestions"][0];
  if (typeof plant !== "object") {
    xx_err_show_resume(new Error("zero match"));
    return;
  }
  plant_info(plant, data["health_assessment"], data["images"][0]["url"]);
}

function plant_info(
  { plant_name, plant_details, probability, confirmed, similar_images },
  { is_healthy, is_healthy_probability, diseases },
  img_url
) {
  let taxonomy = plant_details.taxonomy;
  let synonyms = plant_details.synonyms;
  let structuredName = plant_details.structured_name;
  let diseases_dom = diseases.length ? "" : "none";
  let similar_images_dom = "";
  similar_images.forEach((sim) => {
    similar_images_dom += `<img src="${sim["url_small"]}" id="${sim["id"]}"/>`;
  });
  diseases.forEach((d) => {
    diseases_dom += `<div>${d}</div>`;
  });
  let synonyms_dom = "";
  synonyms.forEach((element) => {
    synonyms_dom += `<div>${element}</div>`;
  });

  let plant_dom = `<div class="plant-url">
    <img src="${img_url}" />
  </div>
  <div>
    <div class="plant-sub-heading">Name</div>
    <div class="plant-sub-detail">${plant_name}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Description</div>
    <div class="plant-sub-detail">${plant_details.wiki_description.value}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Class</div>
    <div class="plant-sub-detail">${taxonomy.class}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Family</div>
    <div class="plant-sub-detail">${taxonomy.family}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Synonyms</div>
    <div class="plant-sub-detail">${synonyms_dom}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Structureed Name</div>
    <div class="plant-sub-detail">genus: ${structuredName["genus"]}</div>
    <div class="plant-sub-detail">species: ${structuredName["species"]}</div>
  </div>
  <div>
    <div class="plant-sub-heading">Others</div>
    <div class="plant-sub-detail">Same: ${probability}</div>
    <div class="plant-sub-detail">CNF: ${confirmed}</div>
    <div class="plant-sub-detail">healthy: ${is_healthy}</div>
    <div class="plant-sub-detail">healthy%: ${is_healthy_probability}</div>
  </div>
  <div class="similar-plant-urls">
    ${similar_images_dom}
  </div>
  <div>
    <div class="plant-sub-heading">Diseases</div>
    <div class="plant-sub-detail">${diseases_dom}</div>
  </div>
  `;

  document.getElementById("plantWrapper").innerHTML = plant_dom;
  spinner.setAttribute("hidden", "");
}
