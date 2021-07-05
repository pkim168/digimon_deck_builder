const axios = require("axios");
var fs = require('fs');

let siteName = "";

const download = async (setId, fileName) => {
  let file = fs.createWriteStream('./images/'+setId+'/'+fileName);
  const response = await axios({
    url: 'https://en.digimoncard.com'+src,
    method: 'GET',
    responseType: 'stream'
  })
  response.data.pipe(file);
};

module.exports = download;
