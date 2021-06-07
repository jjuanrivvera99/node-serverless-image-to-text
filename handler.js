const Tesseract = require('tesseract.js');

module.exports.ocr = async (event, context, callback) => {
  const worker = Tesseract.createWorker({
    logger: m => console.log(m),
    cachePath: "/tmp"
  });

  const dataBody = JSON.parse(event.body);
  // const dataBody = event;

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
