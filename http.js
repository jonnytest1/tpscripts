/// <reference path="./customTypes/index.d.ts" />


/**
 * @param {string} response
 * @returns {boolean}
 */
function shouldLogResponse(response, htmlErrorCheck = true) {
  let refTExt = '<reference path="customTypes/index.d.ts" />';
  let brText = "<br />";
  if (response.includes('console.log("entrypoint");') && response.includes("tampermonkey_base_container")) {
    return (response.split(brText).length > 2 && htmlErrorCheck && response.split(refTExt).length == 1);
  } else {
    const ret = response && htmlErrorCheck &&
      response.includes(brText) &&
      !response.includes(refTExt) &&
      !response.includes("<!DOCTYPE html");
    if (ret) {
      debugger;
    }
    return ret;
  }
}

/**
 *
 * @param {Function } callback
 */
function http(type = "GET", url, callback = () => { }, data = undefined, headers = {}, htmlErrorCheck = true) {
  let request = new XMLHttpRequest();
  if (!url.includes("localhost")) {
    console.log("request to " + url);
  }
  request.open(type, url, true);
  for (let key in headers) {
    request.setRequestHeader(key, headers[key]);
  }

  request.onreadystatechange = event => {
    if (request.readyState == 4) {
      callback(request.responseText);
    }
  };
  //request.send(data);
  let cmdData = data;
  if (headers["Content-Type"] && headers["Content-Type"] == "application/x-www-form-urlencoded") {
    cmdData = decodeURIComponent(cmdData);
  }
  let curlCommand = "curl -X " + type + ' -d "' + cmdData + '"';
  for (let h in headers) {
    curlCommand += " -H " + h + ":" + headers[h] + " ";
  }
  curlCommand += url;
  return new Promise((resolve, error) => {
    if (typeof GM_xmlhttpRequest == "function") {
      GM_xmlhttpRequest({
        method: type,
        url: url,
        onload: data => {
          let responseText = data.responseText;
          if (data.status !== 403 && shouldLogResponse(responseText, htmlErrorCheck)) {
            logKibana("INFO", curlCommand);
            handleError({
              message: responseText.split("\n")[0],
              stack: data.responseText,
              name: ""
            });
          }
          if (data.responseHeaders && data.responseHeaders.includes("logging:")) {
            logKibana("INFO", data.responseHeaders.split("logging:")[1].split("\n")[0]);
          }
          if (data.status == 200) {
            try {
              let json = JSON.parse(data.responseText);
              resolve(json);
              callback(data.responseText);
            } catch (error) {
              callback(data.responseText);
              resolve(data.responseText);
            }
          } else {
            callback(data.status, data);
            error(data);
          }
        },
        data: data,
        headers: headers
      });
    } else {

      fetch(url, {
        method: type,
        body: data,
        headers: headers
      }).then(e => {
        e.text().then(data => {
          try {
            let json = JSON.parse(data);
            resolve(json);
            callback(json);
          } catch (error) {
            callback(data);
            resolve(data);
          }
        });
      });
    }
  });
}

function sendData(url, data, callback) {
  let encodedData = formUrlEncode(data);
  http("POST", url, callback, encodedData, {
    "Content-Type": "application/x-www-form-urlencoded"
  });
}

var formUrlEncode = obj =>
  Object.keys(obj)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
    .join("&");

/**@param {string} url */
function gm_fetch(url) {
  return http("GET", url);
}

new EvalScript('', {}).finish({
  sendData,
  http,
  gm_fetch
})
