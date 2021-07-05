const cheerio = require("cheerio");
const axios = require("axios");

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async (siteUrl) => {
  console.log("Starting: " + siteUrl)
  const $ = await fetchData(siteUrl);
  const images = new Set();

  var cardArr = [];
  var set = $('div[id=maintitle]').children('h3').eq(0).text();
  if (set.split("【").length > 1) {
    var setName = set.split("【").slice(0, -1).join("");
  }
  else {
    var setName = set;
  }
  $('div[class~=card_detail]')
  .each(async (i, element) => {
    if ($(element).find('li[class~=cardParallel]').length) {
      // console.log($(element).find('div[class=card_name]').text());
      return;
    }
    var cardColor = $(element).attr('class');
    cardColor = cardColor.split(" ")[1].split("_")[2];
    cardColor = cardColor.charAt(0).toUpperCase() + cardColor.slice(1);
    var cardName = $(element).find('div[class=card_name]').text();
    var cardInfoHead = $(element).find('ul[class=cardinfo_head]').children('li');
    var cardNo = $(cardInfoHead).eq(0).text();
    var setId = cardNo.split("-")[0];
    var cardRarity = $(cardInfoHead).eq(1).text();
    var cardType = $(cardInfoHead).eq(2).text();
    var cardLv = $(cardInfoHead).eq(3).text().slice();
    if (cardLv === ''){
      cardLv = '-';
    }
    if (cardLv != '-') {
      cardLv = cardLv.replace(/\D/g,'');
    }
    var src = $(element).find('img').attr("src");
    src = siteUrl.split(".com")[0] + ".com" + src.substring(2);
    let temp = src.split("/");
    var filePath = "./images/"+setId+'/'+temp[temp.length-1];
    var alt = $(element).find('img').attr("alt");
    var cardInfoTopBody = $(element).find('div[class=cardinfo_top_body]').children('dl');
    var form = $(cardInfoTopBody).eq(0).children('dd').text();
    var attribute = $(cardInfoTopBody).eq(1).children('dd').text();
    var type = $(cardInfoTopBody).eq(2).children('dd').text();
    var digiPower = $(cardInfoTopBody).eq(3).children('dd').text();
    if (isNaN(digiPower)){
      playCost = '-';
    }
    var playCost = $(cardInfoTopBody).eq(4).children('dd').text();
    if (isNaN(playCost)){
      playCost = '-';
    }
    var digivolve1Cost = $(cardInfoTopBody).eq(5).children('dd').text().split(" ")[0];
    if (isNaN(digivolve1Cost)){
      digivolve1Cost = '-';
    }
    var digivolve2Cost = $(cardInfoTopBody).eq(6).children('dd').text().split(" ")[0];
    if (isNaN(digivolve2Cost)){
      digivolve2Cost = '-';
    }
    var cardInfoBottom = $(element).find('div[class=cardinfo_bottom]').children('dl');
    var effect = $(cardInfoBottom).eq(0).children('dd').text();
    var digivolveEffect = $(cardInfoBottom).eq(1).children('dd').text();
    var securityEffect = $(cardInfoBottom).eq(2).children('dd').text();

    cardArr.push({
      _id: cardNo,
      src: src,
      filePath: filePath,
      alt: alt,
      cardColor: cardColor,
      setName: setName,
      setId: setId,
      cardRarity: cardRarity,
      cardNo: cardNo,
      cardName: cardName,
      cardType: cardType,
      cardLv: cardLv,
      form: form,
      attribute: attribute,
      type: type,
      digiPower: digiPower,
      playCost: playCost,
      digivolve1Cost: digivolve1Cost,
      digivolve2Cost: digivolve2Cost,
      effect: effect,
      digivolveEffect: digivolveEffect,
      securityEffect: securityEffect,
      keywords: {},
      fullText: cardColor+setName+setId+cardRarity+cardNo+cardName+cardType+cardLv+form+attribute+type+digiPower+playCost+digivolve1Cost+digivolve2Cost+effect+digivolveEffect+securityEffect
    });
  });

  console.log("Finished: " + siteUrl);
  //Convert to an array so that we can sort the results.
  return(cardArr);
};

module.exports = getResults;
