const express = require('express');
const path = require('path');
const fs = require('fs');

const filepath = './run.cmd';

/**
 * @param {string} src
 * @param {string} find
 * @return {string}
 */
function stringAfter(src, find) {
  return src.substring(src.indexOf(find) + find.length);
}

/**
 * @param {string} src
 * @param {string} find
 * @return {string}
 */
function stringBefore(src, find) {
  return src.substring(0, src.indexOf(find));
}

/**
 * @typedef Entry
 * @property {string} args
 * @property {string} dir
 */

/**
 * @param {Entry[]} summary
 */
function internalModifyFile(summary) {
  fs.writeFileSync(
      filepath,
      summary.reduce(
          (acc, val) => acc +
`${stringBefore(val.dir, ':')}:
cd ${val.dir}
bgrunner ${val.args}`,
          '',
      ),
      {encoding: 'utf-8'},
  );
}

/**
 * @return {Entry[]}
*/
function getSummary() {
  const data = fs.readFileSync(filepath, {encoding: 'utf-8'})
      .split('\n')
      .filter((i) => i);
  const result = [];
  for (let i = 0; i < data.length; i += 3) {
    const chunk = data.slice(i, i + 3);
    const dir = stringAfter(chunk[1], ' ');
    const args = stringAfter(chunk[2], ' ');
    result.push({dir, args});
  }
  return result;
}

/**
 * @param {Entry} entry
 */
function addAutorunEntry(entry) {
  const summary = getSummary();
  summary.push(entry);
  internalModifyFile(summary);
}

/**
 * @param {number} index
 */
function removeAutorunEntry(index) {
  const summary = getSummary();
  summary.splice(index, 1);
  internalModifyFile(summary);
}

const app = express();

app.use(express.static(path.resolve(__dirname, 'client/build')));

app.get(
    '/api',
    (_, res) => {
      const summary = getSummary();
      return res.json(summary);
    },
);

app.get(
    '/api/set',
    (req, res) => {
      const {dir, args} = req.query;
      if (!dir || !args) {
        return res.json({error: 'invalid query'});
      }
      const dirS = dir.toString();
      if (!path.isAbsolute(dirS)) {
        return res.json({error: 'dir is not absolute'});
      }
      try {
        addAutorunEntry({dir: dir.toString(), args: args.toString()});
        return res.json({success: true});
      } catch (e) {
        return res.json({error: 'cannot write to file', cause: e.message});
      }
    },
);

app.get(
    '/api/delete',
    (req, res) => {
      const {index} = req.query;
      if (!index) {
        return res.json('invalid query');
      }
      try {
        removeAutorunEntry(parseInt(index.toString()));
        return res.json({success: true});
      } catch (e) {
        return res.json({error: 'cannot remove file', cause: e.message});
      }
    },
);

app.get('/*', (_, res) => {
  const index = path.resolve(__dirname, 'client/build/index.html');
  return res.sendFile(index);
});

const unsafePort = parseInt(process.argv[2]);
const port = Number.isInteger(unsafePort) ? unsafePort : 8080;
console.log('Listening on localhost:', port);
app.listen(port);
