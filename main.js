// import * as config from './config.js';

const config = require('./config.js');
var fs = require('fs');
var fetch = require('node-fetch');

let inputCSV;
let log = console.log;
let key = config.PSI_API_KEY || null;

process.argv.forEach((arg, index) => {
  if (process.argv[index] === '--key') {
    key = process.argv[index + 1];
  }
  if (process.argv[index] === '--urls') {
    inputCSV = process.argv[index + 1];
  }
});

if (key) {
  main(key, inputCSV);
} else {
  console.log("Must provide a url parameter. Example:");
  console.group();
  console.log("node main.js --key PSI_KEY");
}

// read list of URLs
function readURLs(fileName) {
  log(`readURLs(${fileName})`);

  var urls = require('fs').readFileSync(fileName, 'utf-8').split('\n');
  return urls;
}

// run PSI on individual URL
function fetchPSI(psiKey, url) {
  let psiAPI = [];

  psiAPI.push(config.PSI_API_URL);
  psiAPI.push('?');
  psiAPI.push(`strategy=mobile`);
  psiAPI.push('&');
  psiAPI.push(`key=${psiKey}`);
  psiAPI.push('&');
  psiAPI.push(`url=${encodeURI(url)}`);

  return fetch(psiAPI.join(''));
}

// return only scores we need
function getScores(results) {
  let scores = {};

  Object.keys(config.FIELDS).forEach(field => {

    try {
      let fieldKey = config.FIELDS[field].key;
      let type = config.FIELDS[field].type;

      tmpResult = eval(`results${fieldKey}`);

      let result = "-";

      switch (type) {
        case 'score':
          result = Math.floor(tmpResult * 100);
          break;
        case 'value':
          result = (tmpResult / 1000).toString().match(/\d*\.\d/)[0];
          break;
        case 'percentile':
          result = (tmpResult * 100).toString().match(/\d*/)[0];
          break;
        case 'displayString':
          result = tmpResult.match(/\d*\.\d/)[0];
          break;
        case 'scriptEvaluation':
          Object.keys(tmpResult).forEach(key => {
            if (tmpResult[key].group == "scriptEvaluation") {
              result = (tmpResult[key].duration / 1000).toString().match(/\d*\.\d/)[0];
            }
          });
          break;
        case 'parseHTML':
          Object.keys(tmpResult).forEach(key => {
            if (tmpResult[key].group == "parseHTML") {
              result = (tmpResult[key].duration / 1000).toString().match(/\d*\.\d{2}/)[0];
            }
          });
          break;
        default:
          result = tmpResult;
          break;
      }

      scores[field] = result;

    } catch (e) {
      scores[field] = "-";
    }

  });
  return scores;
}

// FILE FUNCTIONS

// create writeable stream
function getWriteStream(fileName) {
  var ws = fs.createWriteStream(fileName);
  return ws;
}

// write line to CSV
function writeLine(ws, line) {
  ws.write(line);
  ws.write('\n');
}

// write header
// TODO
function writeHeader(ws) {
  let header = [];

  header.push('URL');

  Object.keys(config.FIELDS).forEach(field => {
    header.push(field);
  });

  ws.write(header.join('|'));
  ws.write('\n');

}

async function main(psiKey, urlCSV) {
  log(`main(${psiKey}, ${urlCSV})`);

  let urls = readURLs(urlCSV);

  let ws = getWriteStream(`${urlCSV.split('.')[0]}-results.csv`);

  writeHeader(ws);

  // run API and write results for each URL
  let pendingTests = 0;
  let promises = [];

  for (let i = 0; i < urls.length; i++) {
    let testID = i;
    console.log(`Running test #${testID+1} on URL: ${urls[testID]}`);

    let promise = fetchPSI(psiKey, urls[testID])
      .then(res => res.json())
      .then(results => {
        console.log(`Finished test #${testID+1}`);

        let scores = getScores(results);

        let line = [];
        line.push(urls[testID]);

        Object.keys(config.FIELDS).forEach(header => {
          line.push(scores[header]);
        });

        let ss = [];
        ss.push(urls[testID]);

        writeLine(ws, line.join('|'));
      }).catch(e => {
        console.log(`ERROR: Test #${testID} failed (${urls[testID]})`);
        console.group();
        console.log(e);
        console.groupEnd();
      });

    promises.push(promise);

    pendingTests += 1;

    if (pendingTests >= config.MAX_PENDING_TESTS) {
      await Promise.all(promises);
      pendingTests = 0;
      promises = []
    }
  }

  await Promise.all(promises);

  ws.end();
}