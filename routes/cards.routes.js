const express = require('express')
const router = express.Router()
const mongodbpool = require('../controllers/mongodbpool')
const app = require('../app')
const tokenvalidator = require('../controllers/tokenvalidator')
var pool = mongodbpool.getDb();
var cors = require('cors');
const getResults = require("../controllers/scraper.js");
var fs = require('fs');
const axios = require("axios");

router.post('/*', tokenvalidator);
router.options('/*', cors({ allowedHeaders: 'x-access-token'}));

// router.use((req, res, next) => {
//   res.append('Access-Control-Allow-Headers', 'x-access-token');
// });

/**
 * GET /cards/
 * Returns all cards in database as array
 */
router.get('/', async function(req, res) {
  pool.collection("cards").find({}).sort({cardNo: 1}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get cards error: " + error});
    } else {
      res.append('Access-Control-Expose-Headers', 'X-Total-Count');
      res.append("X-Total-Count", results.length);
      results.forEach(item => {
        item["id"] = item["_id"];
        delete item["_id"];
      });

      res.send(results);
    }
  });
});

/**
 * GET /cards/filter
 * Returns all cards in database as array
 */
router.get('/filter', async function(req, res) {
  var search = req.query.search;
  var attribute = req.query.attribute;
  var cardLv = req.query.cardLv;
  var cardName = req.query.cardName;
  var cardType = req.query.cardType;
  var color = req.query.color;
  var cost = req.query.cost;
  var digivolveCost = req.query.digivolveCost;
  var form = req.query.form;
  var playEffect = req.query.playEffect;
  var power = req.query.power;
  var securityEffect = req.query.securityEffect;
  var set = req.query.set;
  var type = req.query.type;

  query = {};
  if (search) {
    query["fullText"] = {
      $regex: ".*"+search+".*"
    }
  }
  if (attribute)
    query["attribute"] = attribute;
  if (cardLv)
    query["cardLv"] = cardLv;
  if (cardName) {
    query["cardName"] = {
      $regex: ".*"+cardName+".*"
    }
  }
  if (cardType)
    query["cardType"] = cardType;
  if (color)
    query["cardColor"] = color;
  if (cost)
    query["playCost"] = cost;
  if (digivolveCost)
    query["$or"] = [{digivolve1Cost: digivolveCost}, {digivolve2Cost: digivolveCost}];
  if (form)
    query["form"] = form;
  if (playEffect)
    query["effect"] = playEffect;
  if (power)
    query["digiPower"] = power;
  if (securityEffect)
    query["securityEffect"] = securityEffect;
  if (set)
    query["setNo"] = set;
  if (type)
    query["type"] = type;
  console.log(query);
  pool.collection("cards").find(query).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Filter cards error: " + error});
    } else {
      res.send(results);
    }
  });
});

/**
 * POST /cards/update
 * Updates card database
 */
router.post('/update', async function(req, res) {
  req.connection.setTimeout(60*10*1000);
  console.log("Update Start");
  var siteUrlsJp = ["508005", "508006", "508107", "508108", "508901"];
  var siteUrlsEng = ["522001", "522002", "522003", "522101", "522102", "522103", "522104","522105","522106","522901"];
  siteUrlsJp = siteUrlsJp.map(url => "https://en.digimoncard.com/cardlist/?search=true&category=" + url);
  siteUrlsEng = siteUrlsEng.map(url => "https://world.digimoncard.com/cardlist/?search=true&category=" + url);
  const siteUrls = siteUrlsJp.concat(siteUrlsEng);
  console.log(siteUrls);
  var result = [];
  for (let i = 0; i < siteUrls.length; i ++) {
    var singleSet = await getResults(siteUrls[i]);
    result = result.concat(singleSet);
  }

  var type = new Set();
  // var setName = new Set();
  // var setId = new Set();
  var set = {};
  var digiPower = new Set();
  var cardNo = new Set();
  // var keyword = new Set();

  var count = 0;
  // console.log("Downloading images");
  for (const item of result) {
    var temp = item["type"].split("/");
    temp.forEach((item) => {
      if (item != '')
        type.add(item);
    });

    // let file = fs.createWriteStream(item["filePath"]);
    // const response = await axios({
    //   url: item["src"],
    //   method: 'GET',
    //   responseType: 'stream'
    // });
    //
    // response.data.pipe(file);
    // setName.add(item["setName"]);
    // setId.add(item["setId"]);
    set[item["setId"]] = item["setName"]
    digiPower.add(item["digiPower"]);
    cardNo.add(item["cardNo"]+'_'+item["cardName"]);
    count++;
    // console.log((count) + " of " + result.length);
  }
  // console.log("Download Complete");

  // Push all images to server
  console.log("Updating " + result.length.toString()+" cards");
  var bulkUpdateOps = [];
  result.forEach(function(doc) {
    bulkUpdateOps.push({
      "updateOne": {
        "filter": { "_id": doc.cardNo },
        "update": { "$set": {
          "_id": doc.cardNo,
          "src": doc.src,
          "filePath": doc.filePath,
          "alt": doc.alt,
          "setName": doc.setName,
          "setId": doc.setId,
          "cardColor": doc.cardColor,
          "cardNo": doc.cardNo,
          "cardRarity": doc.cardRarity,
          "cardName": doc.cardName,
          "cardType": doc.cardType,
          "cardLv": doc.cardLv,
          "form": doc.form,
          "attribute": doc.attribute,
          "type": doc.type,
          "digiPower": doc.digiPower,
          "playCost": doc.playCost,
          "digivolve1Cost": doc.digivolve1Cost,
          "digivolve2Cost": doc.digivolve2Cost,
          "effect": doc.effect,
          "digivolveEffect": doc.digivolveEffect,
          "securityEffect": doc.securityEffect,
          "keywords": doc.keywords,
          "fullText": doc.fullText
        } },
        "upsert": true
      }
    });
  })

  pool.collection('cards').bulkWrite(bulkUpdateOps, (error, r) => {
    if (error) {
      return res.status(500).json({success: false, message: "Update cards error: " + error})
    }
  });

  // var setNameArr = [...setName];
  // var setIdArr = [...setId];
  bulkUpdateOps = [];
  var i = 0;
  for (var key in set) {
    bulkUpdateOps.push({
      "updateOne": {
        "filter": { "_id": key },
        "update": { "$set": {
          "_id": key,
          "setName": set[key]
        } },
        "upsert": true
      }
    });
    i++;
  }
  // setNameArr.forEach((item, i) => {
  //   bulkUpdateOps.push({
  //     "updateOne": {
  //       "filter": { "_id": i },
  //       "update": { "$set": {
  //         "_id": i,
  //         "setName": item,
  //         "setId": setIdArr[i]
  //       } },
  //       "upsert": true
  //     }
  //   });
  // });

  pool.collection('sets').bulkWrite(bulkUpdateOps, (error, r) => {
    if (error) {
      return res.status(500).json({success: false, message: "Update sets error: " + error})
    }
  });

  var typeArr = [...type].sort();
  bulkUpdateOps = [];
  typeArr.forEach((item, i) => {
    bulkUpdateOps.push({
      "updateOne": {
        "filter": { "_id": item },
        "update": { "$set": {
          "_id": item
        } },
        "upsert": true
      }
    });
  });

  pool.collection('types').bulkWrite(bulkUpdateOps, (error, r) => {
    if (error) {
      return res.status(500).json({success: false, message: "Update types error: " + error})
    }
  });

  var digiPowerArr = [...digiPower].sort();
  bulkUpdateOps = [];
  digiPowerArr.forEach((item, i) => {
    bulkUpdateOps.push({
      "updateOne": {
        "filter": { "_id": item },
        "update": { "$set": {
          "_id": item
        } },
        "upsert": true
      }
    });
  });

  pool.collection('digiPower').bulkWrite(bulkUpdateOps, (error, r) => {
    if (error) {
      return res.status(500).json({success: false, message: "Update digiPower error: " + error})
    }
  });

  var cardNoArr = [...cardNo].sort();
  bulkUpdateOps = [];
  cardNoArr.forEach((item, i) => {
    bulkUpdateOps.push({
      "updateOne": {
        "filter": { "_id": item.split("_")[0] },
        "update": { "$set": {
          "_id": item.split("_")[0],
          "cardName": item.split("_")[1]
        } },
        "upsert": true
      }
    });
  });

  pool.collection('cardNo').bulkWrite(bulkUpdateOps, (error, r) => {
    if (error) {
      return res.status(500).json({success: false, message: "Update cardNo error: " + error})
    }
  });

  console.log("Update Complete");
  return res.json({success: true, message: "Update Complete. Rows: " + result.length})
});

/**
 * GET /cards/cardNo
 */
router.get('/cardNo', async function(req, res) {
  pool.collection("cardNo").find({}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get cardNo error: " + error});
    } else {
      var result = [];
      results.forEach(item => {
        result.push({cardNo: item["_id"], cardName: item["cardName"]});
      });

      res.send(result);
    }
  });
});

/**
 * GET /cards/power
 */
router.get('/power', async function(req, res) {
  pool.collection("digiPower").find({}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get power error: " + error});
    } else {
      var result = [];
      results.forEach(item => {
        result.push(item["_id"]);
      });

      res.send(result);
    }
  });
});

/**
 * GET /cards/sets
 */
router.get('/sets', async function(req, res) {
  pool.collection("sets").find({}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get sets error: " + error});
    } else {
      var result = [];
      results.forEach(item => {
        result.push(item["_id"]);
      });

      res.send(result);
    }
  });
});

/**
 * GET /cards/types
 */
router.get('/types', async function(req, res) {
  pool.collection("types").find({}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get types error: " + error});
    } else {
      var result = [];
      results.forEach(item => {
        result.push(item["_id"]);
      });

      res.send(result);
    }
  });
});
module.exports = router;
