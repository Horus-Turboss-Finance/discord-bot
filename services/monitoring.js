const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let URLS = require('../utils/websites.links');
let worker = require('../core/Workers/worker');
/* Updated : 04.08.2025 by horus - snapshot type change */
let { snapshotPageDetailed } = require('../utils/snapshot');

/* --- JSON UTILS --- */
function loadJson(path) {
  return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
}
function saveJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

/* --- Hash contenu --- */
function hashContent(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/* --- Vérification et comparaison --- */
/* Update : 04.08.2025 by Horus - Change type detect */
const captureAndCompare = async (urls) => {
  const logDir = path.join(__dirname, '../log');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const dataFile = path.resolve(logDir, 'hash-data.json');
  const errorFile = path.resolve(logDir, 'error-data.json');

  const baselineData = loadJson(dataFile);
  const errorData = loadJson(errorFile);

  const changePage = [];
  const errorPage = [];
  const times = [];

  for (const url of urls) {
    try {
      const start = Date.now();
      const snapshot = await snapshotPageDetailed(url);
      const duration = Date.now() - start;
      times.push(duration);

      const hash = {
        html: hashContent(snapshot.html),
        css: hashContent(snapshot.css),
        js: hashContent(snapshot.js),
        img: hashContent(snapshot.img),
      };

      const previous = baselineData[url];

      if (
        !previous ||
        previous.html !== hash.html ||
        previous.css !== hash.css ||
        previous.js !== hash.js ||
        previous.img !== hash.img
      ) {
        changePage.push({url, change : {
          html: previous.html !== hash.html,
          img : previous.img !== hash.img,
          css : previous.css !== hash.css,
          js  : previous.js !== hash.js,
        }});
        baselineData[url] = hash;
      }

    } catch (err) {
      errorPage.push(url);
      errorData[url] = Date.now();
    }
  }

  saveJson(dataFile, baselineData);
  saveJson(errorFile, errorData);

  const avgPing = times.length ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  return { changePage, errorPage, averagePing: avgPing };
}

/* --- Worker principal --- */
let mainWorker = async () => {
  for (const typeUrl in URLS) {
    try{
      const job = await captureAndCompare(URLS[typeUrl]);
      
      if(job.changePage.length) worker.emit(worker.eventsList.WorkerFundPageChange, {type:typeUrl, arr:job.changePage});
      if(job.errorPage.length) worker.emit(worker.eventsList.WorkerHasPageError, {type:typeUrl, arr:job.errorPage});

      worker.emit(worker.eventsList.WorkerUpdatePagePing, {type:typeUrl, cfr:job.averagePing});
    }catch(e){
      console.error('[Worker error]', e);
    }
  }
}

/* Lancer le worker */
mainWorker();
setInterval(mainWorker, 5 * 60 * 1000);
/* Interface de 5min */