const pako = require('pako');
const fs = require('fs');

[
  'dist/liljs.esm.min.js',
  'dist/liljs.umd.min.js',
].forEach((file) => {
  fs.readFile(file, (readError, data) => {
    const compressedFile = pako.gzip(data);
    fs.writeFile(`${file}.gzip`, compressedFile, (writeError) => {
      if (writeError) console.log('Unable to gzip file!');
    });
  });
});
