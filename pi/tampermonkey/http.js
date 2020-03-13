/// <reference path="./customTypes/index.d.ts" />
/**
 * @typedef httpResolv
 * @property {httpFnc} http
 * @property {(url:string,errorCheck?:boolean)=>Promise<any>} gm_fetch
 * @property {sendDataFnc} sendData
  */
/**
* @callback httpFnc
* @param {"GET"|"POST"}type
* @param {string } url
* @param { Function } [callback]
* @param { any } [data]
* @param { any } [headers]
* @param {boolean} [htmlErrorCheck]
* @returns {Promise<any>}
* @global
*
*/

/**
 * @callback sendDataFnc
 * @param {string} url
 * @param {any} data
 * @param {Function} callback
 */

new EvalScript('', {
  run: async (resolver) => {
    /**
     * @param {string} response
     * @returns {boolean}
     */
    function shouldLogResponse(response, htmlErrorCheck = true) {
      if(!response) {
        //debugger;
        return false;
      }
      return false;
      let refTExt = '<reference path="customTypes/index.d.ts" />';
      let brText = '<br />';
      if(response.includes('console.log("entrypoint");') && response.includes('tampermonkey_base_container')) {
        console.log();
        return (response.split(brText).length > 2 && htmlErrorCheck && response.split(refTExt).length === 1);
      } else {
        const ret = response && htmlErrorCheck &&
          response.includes(brText) &&
          !response.includes(refTExt) &&
          !response.includes('<!DOCTYPE html');
        if(ret) {
          debugger;
          console.log(response);
        }
        return ret;
      }
    }
    /**
     * @type {httpFnc}
     */
    async function http(type = 'GET', url, callback = () => console.log, data = null, headers = {}, htmlErrorCheck = true) {
      let request = new XMLHttpRequest();
      if(!url.includes('localhost') && !url.includes('.e6azumuvyiabvs9')) {
        console.log('request to ' + url);
      }
      request.open(type, url, true);
      for(let key in headers) {
        request.setRequestHeader(key, headers[key]);
      }

      request.onreadystatechange = event => {
        if(request.readyState === 4) {

          callback(request.responseText);
        }
      };
      //request.send(data);

      let stack = '';
      try {
        stack['t']();
      } catch(e) {
        stack = e.stack;
      }
      let cmdData = data;
      if(headers['Content-Type'] && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        cmdData = decodeURIComponent(cmdData);
      }
      let curlCommand = `curl -X ${type} `;
      if(data) {
        curlCommand += `-d "${cmdData}" `;
      }
      for(let h in headers) {
        curlCommand += `-H ${h}:${headers[h]} `;
      }
      curlCommand += url;
      return new Promise((resolve, error) => {
        if(typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method: type,
            url: url,
            onerror: (e) => {
              debugger;
              error(e);
            },
            ontimeout: (e) => {
              debugger;
              error(e);
            },
            onabort: (e) => {
              debugger;
              error(e);
            },
            onload: response => {
              let responseText = response.responseText;
              if(response.status !== 403 && shouldLogResponse(responseText, htmlErrorCheck)) {
                console.log(curlCommand);
                const log = {
                  message: responseText.split('\n')[0],
                  stack: `${stack}`,
                  curlcommand: curlCommand,
                  response: response.responseText,
                  name: ''
                };
                handleError(log);
                error(log);
              }
              if(response.responseHeaders && response.responseHeaders.includes('logging:')) {
                logKibana('INFO', response.responseHeaders.split('logging:')[1]
                  .split('\n')[0]);
              }
              if(response.status === 200) {
                try {
                  let json = JSON.parse(response.responseText);
                  resolve(json);
                  callback(response.responseText);
                } catch(error) {
                  callback(response.responseText);
                  resolve(response.responseText);
                }
              } else {
                callback(response.status, response);
                error(response);
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
          })
            .then(e => {
              e.text()
                .then(text => {
                  try {
                    let json = JSON.parse(text);
                    resolve(json);
                    callback(json);
                  } catch(error) {
                    callback(text);
                    resolve(text);
                  }
                });
            });
        }
      });
    }
    /**
     *
     * @type {sendDataFnc}
     */
    function sendData(url, data, callback) {
      let encodedData = formUrlEncode(data);
      return http('POST', url, callback, encodedData, {
        'Content-Type': 'application/x-www-form-urlencoded'
      });
    }

    var formUrlEncode = obj =>
      Object.keys(obj)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        .join('&');

    /**@param {string} url */
    async function gm_fetch(url, errorCheck) {
      return http('GET', url, undefined, undefined, undefined, errorCheck);
    }

    let resolving = {
      sendData,
      http,
      gm_fetch
    };
    resolver(resolving);

  }
});
