/// <reference path="../../customTypes/index.d.ts" />

var logHistory = {};
var prepareScript = () => {
  if(!scriptContent) {
    return '';
  }
  let lines = scriptContent.split('\n');
  let number = 1;

  return lines.map(str => `${number++}\t${str}`)
    .join('\n');
};

function logInfo(message, error) {
  logKibana('INFO', message, error);
}
/** @global
 * @param {"INFO"|'ERROR'|'DEBUG'} level
 * @param {string|Object} message
 * @param {any} [error]
*/
function logKibana(level, message, error) {
  error = { ...error };
  let jsonMessage = message;
  if(!jsonMessage && error) {
    jsonMessage = error.message;
  }
  if(jsonMessage instanceof Object) {
    try {
      btoa(JSON.stringify(jsonMessage));
      jsonMessage = JSON.stringify(jsonMessage);
    } catch(e) {
      let tmp = {};
      for(let i in jsonMessage) {
        try {
          btoa(JSON.stringify(jsonMessage[i]));
          tmp[i] = jsonMessage[i];
        } catch(e) {
          tmp[i] = 'error parsing for' + i;
        }
      }
      jsonMessage = JSON.stringify(tmp);
    }
  }
  let jsonData = {
    Severity: level,
    application: 'clientJS',
    message: jsonMessage
  };

  if(error) {
    jsonData.error_message = error.message;
    jsonData.error_stacktrace = error.stack;
    delete error.message;
    delete error.stack;
    jsonData = { ...jsonData, ...error };
  }
  GM_xmlhttpRequest({
    method: 'POST',
    // @ts-ignore
    url: `${document.window.backendUrl}/libs/log/index.php`,
    headers: {
      'Content-Type': 'text/plain'
    },
    data: btoa(JSON.stringify(jsonData)),
    onerror: console.log,
    onabort: e => {
      debugger;
    },
    onload: (res) => {
      debugger;
      return;
    }
  });
}

function evalError(e) {
  if(!e.stack.includes('extension') && !e.stack.includes('<br />')) {
    return;
  }
  handleError(e);
}

/**
 * @param {Error} e
 * @global
 */
function handleError(e) {
  logKibana('ERROR', undefined, e);
  let note = '';
  if(scriptContent) {
    let scriptMessage = scriptContent;
    const splitScriptContent = scriptMessage.split('error</b>:');
    if(splitScriptContent.length > 2) {
      scriptMessage = splitScriptContent[1];
      note = scriptMessage
        .replace(/<br \/>\n/gm, '')
        .replace(/<b>/gm, '')
        .replace(/<\/b>/gm, '')
        .replace('Parse error:', '')
        .replace('syntax error,', '')
        .trim();
    }
  }
  if(note === '') {
    note = e.message;
  }
  if(
    !logHistory[e.stack] ||
    logHistory[e.stack] < new Date().valueOf() - 1000 * 60
  ) {
    logHistory[e.stack] = new Date().valueOf();
    //let file = calculateFile(e.stack, prepareScript());
    console.error(`${location.href}\n${e.stack}`);

    const notificationOptions = {
      title: location.href,
      text: note,
      silent: true,
      tag: 'error',
      actions: [

      ],
      image:
        'https://www.shareicon.net/data/128x128/2017/06/21/887388_energy_512x512.png',
      onclick: () => {
        try {
          let logContent = `${location.href}\n${e.stack}`;
          GM_setClipboard(logContent);
        } catch(error) {
          GM_setClipboard(`${location.href}\n${error.stack}`);
        }
      }
    };

    /*let noti = new Notification(notificationOptions.title, {
      ...notificationOptions, icon: notificationOptions.image, renotify: true
    })
    noti.onclick = notificationOptions.onclick;*/
    GM_notification(notificationOptions);
  } else {
    console.trace(e.stack + ' appeared again not sending');
  }
}

function calculateFile(stack, scriptText) {
  let lineNumber = stack.split('\n')[1]
    .split(':')[1];

  let stacking = 0;
  let lineInFile = 0;
  for(let line = lineNumber - 1; line >= 0; line--) {
    let currebtLine = scriptText.split('\n')[line];
    if(currebtLine.includes('//___file')) {
      if(stacking === 0) {
        return { file: currebtLine.split('/___file=')[1], line: lineInFile };
      }
      stacking--;
      lineInFile--;
    } else if(currebtLine.includes('//===file-end=')) {
      stacking++;
      lineInFile--;
    }
    if(stacking === 0) {
      lineInFile++;
    }
  }
  return null;
}
window.evalError = evalError;
window.logKibana = logKibana;
window.handleError = handleError;
window.sc.D.e = handleError;
window.sc.D.l = (message, error) => {
  logKibana('INFO', message, error);
};

new EvalScript('', {}).finish(undefined);
