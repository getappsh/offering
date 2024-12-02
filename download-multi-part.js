
const fs = require('fs');
const https = require('https');
const url = 'https://www.learningcontainer.com/bfd_download/large-sample-image-file-download-for-testing/';
const file = 'large-file.jpg';
const options = {
  headers: {},
  agent: false
};
let startByte = 0;

// Check if file already exists
if (fs.existsSync(file)) {
  // Get the size of the file and set it as the starting byte for the next request
  const stats = fs.statSync(file);
  startByte = stats.size;
  // Set the Range header to start from where we left off
  options.headers.Range = `bytes=${startByte}-`;
}

// Send the request to download the file
options.agent = new https.Agent(options);
options.headers['Content-Length'] = startByte;
https.get(url, options, (response) => {
  const totalBytes = parseInt(response.headers['content-length']) + startByte;
  let downloadedBytes = startByte;
  let downloadSpeed = 0;
  let startTime = Date.now();

  const writable = fs.createWriteStream(file, { flags: 'a' });
  response.pipe(writable);

  response.on('data', (chunk) => {
    downloadedBytes += chunk.length;
    const elapsedTime = (Date.now() - startTime) / 1000;
    downloadSpeed = (downloadedBytes / elapsedTime) / 1024 / 1024;
    const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
    console.log(`Downloaded ${progress}% (${downloadedBytes}/${totalBytes} bytes) at ${downloadSpeed.toFixed(2)} MB/s`);
  });

  response.on('end', () => {
    console.log(`Download complete: ${downloadedBytes} bytes downloaded at an average speed of ${downloadSpeed.toFixed(2)} MB/s`);
  });
});
