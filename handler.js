const Tesseract = require('tesseract.js');
const exec = require('child_process').exec;

const child = () => {
  exec('./test.sh', (error, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
          console.log('exec error: ' + error);
    }
  });
}

child();

module.exports.ocr = async (event, context, callback) => {
  const worker = Tesseract.createWorker({
    logger: m => console.log(m),
    langPath: '/tmp',
    cachePath: "/tmp"
  });

  console.log(event.body);

  const dataBody = JSON.parse(event.body);

  console.log(dataBody);

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  const { data: { text } } = await worker.recognize(dataBody.image);

  await worker.terminate();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      text: text,
    }),
  };
};
