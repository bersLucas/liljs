const pako = require('pako');
const fs = require('fs');

fs.readFile('dist/liljs.min.js', (readError, data) => {
  const compressedFile = pako.gzip(data);
  fs.writeFile('dist/liljs.min.js.gzip', compressedFile, (writeError) => {
    if (writeError) console.log('Unable to gzip file!');
  });
});
