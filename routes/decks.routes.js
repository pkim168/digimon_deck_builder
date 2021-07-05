const express = require('express')
const router = express.Router()
const mongodbpool = require('../controllers/mongodbpool')
const app = require('../app')
const tokenvalidator = require('../controllers/tokenvalidator')
var pool = mongodbpool.getDb();
var cors = require('cors');
const getResults = require("../controllers/scraper.js");
const axios = require("axios");
var ObjectID = require('mongodb').ObjectID;

router.post('/*', tokenvalidator);
router.options('/*', cors({ allowedHeaders: 'x-access-token'}));

// router.use((req, res, next) => {
//   res.append('Access-Control-Allow-Headers', 'x-access-token');
// });

/**
 * GET /decks/
 * Returns all decks by user in database as array
 */
router.get('/', async function(req, res) {
  var username = req.query.username;
  console.log(username);
  if (!username)
    return res.status(500).json({success: false, message: "Expected username"});

  pool.collection("decks").aggregate(
    [
        {
            "$match" : {
                "user" : username
            }
        },
        {
            "$unwind" : {
                "path" : "$mainDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$lookup" : {
                "from" : "cards",
                "let" : {
                    "id" : "$mainDeck.id",
                    "count" : "$mainDeck.count"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$eq" : [
                                    "$_id",
                                    "$$id"
                                ]
                            }
                        }
                    },
                    {
                        "$addFields" : {
                            "count" : "$$count",
                            "id" : "$$id"
                        }
                    }
                ],
                "as" : "mainDeck"
            }
        },
        {
            "$unwind" : {
                "path" : "$mainDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$unwind" : {
                "path" : "$eggDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$lookup" : {
                "from" : "cards",
                "let" : {
                    "id" : "$eggDeck.id",
                    "count" : "$eggDeck.count"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$eq" : [
                                    "$_id",
                                    "$$id"
                                ]
                            }
                        }
                    },
                    {
                        "$addFields" : {
                            "count" : "$$count",
                            "id" : "$$id"
                        }
                    }
                ],
                "as" : "eggDeck"
            }
        },
        {
            "$unwind" : {
                "path" : "$eggDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$group" : {
                "_id" : "$_id",
                "mainDeck" : {
                    "$addToSet" : "$mainDeck"
                },
                "mainDeckInfo" : {
                    "$first" : "$mainDeckInfo"
                },
                "mainDeckCount" : {
                    "$first" : "$mainDeckCount"
                },
                "eggDeck" : {
                    "$addToSet" : "$eggDeck"
                },
                "eggDeckInfo" : {
                    "$first" : "$eggDeckInfo"
                },
                "eggDeckCount" : {
                    "$first" : "$eggDeckCount"
                },
                "status" : {
                    "$first" : "$status"
                },
                "title" : {
                    "$first" : "$title"
                },
                "privacy" : {
                    "$first" : "$privacy"
                },
                "user" : {
                    "$first" : "$user"
                },
                "creation" : {
                    "$first" : "$creation"
                },
                "update" : {
                    "$first" : "$update"
                }
            }
        }
    ],
    {
        "allowDiskUse" : false
    }
  ).sort({update: -1}).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get decks error: " + error});
    } else {
      console.log(JSON.stringify(results))
      res.append('Access-Control-Expose-Headers', 'X-Total-Count');
      res.append("X-Total-Count", results.length);
      results.forEach(item => {
        item["id"] = item["_id"];
        delete item["_id"];
      });
      console.log(results);
      res.send(results);
    }
  });
});
/**
 * GET /decks/deckdb
 * Returns all decks in database as array
 */
router.get('/deckdb', async function(req, res) {
  var limit = req.query.limit;
  if (isNaN(limit)) {
    pool.collection("decks").aggregate(
      [
          {
              "$match" : {
                  "status" : "Complete",
                  "privacy": false
              }
          },
          {
              "$unwind" : {
                  "path" : "$mainDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$lookup" : {
                  "from" : "cards",
                  "let" : {
                      "id" : "$mainDeck.id",
                      "count" : "$mainDeck.count"
                  },
                  "pipeline" : [
                      {
                          "$match" : {
                              "$expr" : {
                                  "$eq" : [
                                      "$_id",
                                      "$$id"
                                  ]
                              }
                          }
                      },
                      {
                          "$addFields" : {
                              "count" : "$$count",
                              "id" : "$$id"
                          }
                      }
                  ],
                  "as" : "mainDeck"
              }
          },
          {
              "$unwind" : {
                  "path" : "$mainDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$unwind" : {
                  "path" : "$eggDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$lookup" : {
                  "from" : "cards",
                  "let" : {
                      "id" : "$eggDeck.id",
                      "count" : "$eggDeck.count"
                  },
                  "pipeline" : [
                      {
                          "$match" : {
                              "$expr" : {
                                  "$eq" : [
                                      "$_id",
                                      "$$id"
                                  ]
                              }
                          }
                      },
                      {
                          "$addFields" : {
                              "count" : "$$count",
                              "id" : "$$id"
                          }
                      }
                  ],
                  "as" : "eggDeck"
              }
          },
          {
              "$unwind" : {
                  "path" : "$eggDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$group" : {
                  "_id" : "$_id",
                  "mainDeck" : {
                      "$addToSet" : "$mainDeck"
                  },
                  "mainDeckInfo" : {
                      "$first" : "$mainDeckInfo"
                  },
                  "mainDeckCount" : {
                      "$first" : "$mainDeckCount"
                  },
                  "eggDeck" : {
                      "$addToSet" : "$eggDeck"
                  },
                  "eggDeckInfo" : {
                      "$first" : "$eggDeckInfo"
                  },
                  "eggDeckCount" : {
                      "$first" : "$eggDeckCount"
                  },
                  "status" : {
                      "$first" : "$status"
                  },
                  "title" : {
                      "$first" : "$title"
                  },
                  "privacy" : {
                      "$first" : "$privacy"
                  },
                  "user" : {
                      "$first" : "$user"
                  },
                  "creation" : {
                      "$first" : "$creation"
                  },
                  "update" : {
                      "$first" : "$update"
                  }
              }
          }
      ],
      {
          "allowDiskUse" : false
      }
    ).sort({update: -1}).toArray((error, results) => {
      if (error) {
        return res.status(500).json({success: false, message: "Get decks error: " + error});
      } else {
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');
        res.append("X-Total-Count", results.length);
        results.forEach(item => {
          item["id"] = item["_id"];
          delete item["_id"];
          // Aggregation query problem where if eggDeck is empty, it creates an index 0 that is empty. Keep until fix is found
          if (!item["eggDeck"][0]["id"])
            item["eggDeck"] = [];
        });

        res.send(results);
      }
    });
  }
  else {
    pool.collection("decks").aggregate(
      [
          {
              "$match" : {
                  "status" : "Complete",
                  "privacy": false
              }
          },
          {
              "$unwind" : {
                  "path" : "$mainDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$lookup" : {
                  "from" : "cards",
                  "let" : {
                      "id" : "$mainDeck.id",
                      "count" : "$mainDeck.count"
                  },
                  "pipeline" : [
                      {
                          "$match" : {
                              "$expr" : {
                                  "$eq" : [
                                      "$_id",
                                      "$$id"
                                  ]
                              }
                          }
                      },
                      {
                          "$addFields" : {
                              "count" : "$$count",
                              "id" : "$$id"
                          }
                      }
                  ],
                  "as" : "mainDeck"
              }
          },
          {
              "$unwind" : {
                  "path" : "$mainDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$unwind" : {
                  "path" : "$eggDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$lookup" : {
                  "from" : "cards",
                  "let" : {
                      "id" : "$eggDeck.id",
                      "count" : "$eggDeck.count"
                  },
                  "pipeline" : [
                      {
                          "$match" : {
                              "$expr" : {
                                  "$eq" : [
                                      "$_id",
                                      "$$id"
                                  ]
                              }
                          }
                      },
                      {
                          "$addFields" : {
                              "count" : "$$count",
                              "id" : "$$id"
                          }
                      }
                  ],
                  "as" : "eggDeck"
              }
          },
          {
              "$unwind" : {
                  "path" : "$eggDeck",
                  "preserveNullAndEmptyArrays" : true
              }
          },
          {
              "$group" : {
                  "_id" : "$_id",
                  "mainDeck" : {
                      "$addToSet" : "$mainDeck"
                  },
                  "mainDeckInfo" : {
                      "$first" : "$mainDeckInfo"
                  },
                  "mainDeckCount" : {
                      "$first" : "$mainDeckCount"
                  },
                  "eggDeck" : {
                      "$addToSet" : "$eggDeck"
                  },
                  "eggDeckInfo" : {
                      "$first" : "$eggDeckInfo"
                  },
                  "eggDeckCount" : {
                      "$first" : "$eggDeckCount"
                  },
                  "status" : {
                      "$first" : "$status"
                  },
                  "title" : {
                      "$first" : "$title"
                  },
                  "privacy" : {
                      "$first" : "$privacy"
                  },
                  "user" : {
                      "$first" : "$user"
                  },
                  "creation" : {
                      "$first" : "$creation"
                  },
                  "update" : {
                      "$first" : "$update"
                  }
              }
          }
      ],
      {
          "allowDiskUse" : false
      }
    ).sort({update: -1}).limit(parseInt(limit)).toArray((error, results) => {
      if (error) {
        return res.status(500).json({success: false, message: "Get decks error: " + error});
      } else {
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');
        res.append("X-Total-Count", results.length);
        results.forEach(item => {
          item["id"] = item["_id"];
          delete item["_id"];
          // Aggregation query problem where if eggDeck is empty, it creates an index 0 that is empty. Keep until fix is found
          if (!item["eggDeck"][0]["id"])
            item["eggDeck"] = [];
        });

        res.send(results);
      }
    });
  }
});

/**
 * GET /deck/?:_id
 * Returns requested deck
 */
router.get('/deck', async function(req, res) {
  if (!req.query._id)
    return res.status(500).json({success: false, message: "Expected deck id"});

  try {
    new ObjectID(String(req.query._id));
  }
  catch (err) {
    return res.status(500).json({success: false, message: err})
  }
  pool.collection("decks").aggregate(
    [
        {
            "$match" : {
                "_id" : new ObjectID(String(req.query._id))
            }
        },
        {
            "$unwind" : {
                "path" : "$mainDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$lookup" : {
                "from" : "cards",
                "let" : {
                    "id" : "$mainDeck.id",
                    "count" : "$mainDeck.count"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$eq" : [
                                    "$_id",
                                    "$$id"
                                ]
                            }
                        }
                    },
                    {
                        "$addFields" : {
                            "count" : "$$count",
                            "id" : "$$id"
                        }
                    }
                ],
                "as" : "mainDeck"
            }
        },
        {
            "$unwind" : {
                "path" : "$mainDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$unwind" : {
                "path" : "$eggDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$lookup" : {
                "from" : "cards",
                "let" : {
                    "id" : "$eggDeck.id",
                    "count" : "$eggDeck.count"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$eq" : [
                                    "$_id",
                                    "$$id"
                                ]
                            }
                        }
                    },
                    {
                        "$addFields" : {
                            "count" : "$$count",
                            "id" : "$$id"
                        }
                    }
                ],
                "as" : "eggDeck"
            }
        },
        {
            "$unwind" : {
                "path" : "$eggDeck",
                "preserveNullAndEmptyArrays" : true
            }
        },
        {
            "$group" : {
                "_id" : "$_id",
                "mainDeck" : {
                    "$addToSet" : "$mainDeck"
                },
                "mainDeckInfo" : {
                    "$first" : "$mainDeckInfo"
                },
                "mainDeckCount" : {
                    "$first" : "$mainDeckCount"
                },
                "eggDeck" : {
                    "$addToSet" : "$eggDeck"
                },
                "eggDeckInfo" : {
                    "$first" : "$eggDeckInfo"
                },
                "eggDeckCount" : {
                    "$first" : "$eggDeckCount"
                },
                "status" : {
                    "$first" : "$status"
                },
                "title" : {
                    "$first" : "$title"
                },
                "privacy" : {
                    "$first" : "$privacy"
                },
                "user" : {
                    "$first" : "$user"
                },
                "creation" : {
                    "$first" : "$creation"
                },
                "update" : {
                    "$first" : "$update"
                }
            }
        }
    ],
    {
        "allowDiskUse" : false
    }
  ).toArray((error, results) => {
    if (error) {
      return res.status(500).json({success: false, message: "Get decks error: " + error});
    } else {
      res.append('Access-Control-Expose-Headers', 'X-Total-Count');
      res.append("X-Total-Count", results.length);
      results.forEach(item => {
        item["id"] = item["_id"];
        delete item["_id"];
        // Aggregation query problem where if eggDeck is empty, it creates an index 0 that is empty. Keep until fix is found
        if (!item["eggDeck"][0]["id"])
          item["eggDeck"] = [];
      });
      res.send(results[0]);
    }
  });
  // pool.collection("decks").find({_id: new ObjectID(String(req.query._id))}).toArray((error, results) => {
  //   if (error) {
  //     return res.status(500).json({success: false, message: "Get decks error: " + error});
  //   } else {
  //     res.append('Access-Control-Expose-Headers', 'X-Total-Count');
  //     res.append("X-Total-Count", results.length);
  //     results.forEach(item => {
  //       item["id"] = item["_id"];
  //       delete item["_id"];
  //     });
  //     res.send(results[0]);
  //   }
  // });
});

/**
 * POST /decks/update
 * Deletes deck
 */
router.post('/delete', async function(req, res) {
  if (!req.body._id)
    return res.status(500).json({success: false, message: "Expected deck id"});
  if (!req.body.user)
    return res.status(500).json({success: false, message: "Expected username"});

  pool.collection("decks").remove({_id: new ObjectID(String(req.body["_id"])), user: String(req.body["user"])}, (error, result) => {
    if (error)
      return res.status(500).json({success: false, message: "Delete error: " + error});
    else
      return res.json({success: true, message: "Delete Complete"});
  });

});

/**
 * GET /decks/filter
 * Returns filtered decks in database as array
 */
// router.get('/filter', async function(req, res) {
//   var search = String(req.query.search);
//   var attribute = String(req.query.attribute);
//   var cardLv = String(req.query.cardLv);
//   var cardName = String(req.query.cardName);
//   var cardType = String(req.query.cardType);
//   var color = String(req.query.color);
//   var cost = String(req.query.cost);
//   var digivolveCost = String(req.query.digivolveCost);
//   var form = String(req.query.form);
//   var playEffect = String(req.query.playEffect);
//   var power = String(req.query.power);
//   var securityEffect = String(req.query.securityEffect);
//   var set = String(req.query.set);
//   var type = String(req.query.type);
//
//   query = {};
//   if (search) {
//     query["fullText"] = {
//       $regex: ".*"+search+".*"
//     }
//   }
//   if (attribute)
//     query["attribute"] = attribute;
//   if (cardLv)
//     query["cardLv"] = cardLv;
//   if (cardName) {
//     query["cardName"] = {
//       $regex: ".*"+cardName+".*"
//     }
//   }
//   if (cardType)
//     query["cardType"] = cardType;
//   if (color)
//     query["cardColor"] = color;
//   if (cost)
//     query["playCost"] = cost;
//   if (digivolveCost)
//     query["$or"] = [{digivolve1Cost: digivolveCost}, {digivolve2Cost: digivolveCost}];
//   if (form)
//     query["form"] = form;
//   if (playEffect)
//     query["effect"] = playEffect;
//   if (power)
//     query["digiPower"] = power;
//   if (securityEffect)
//     query["securityEffect"] = securityEffect;
//   if (set)
//     query["setNo"] = set;
//   if (type)
//     query["type"] = type;
//   console.log(query);
//   pool.collection("cards").find(query).toArray((error, results) => {
//     if (error) {
//       return res.status(500).json({success: false, message: "Filter decks error: " + error});
//     } else {
//       res.send(results);
//     }
//   });
// });

/**
 * POST /decks/submit
 * Creates new deck
 */
router.post('/submit', async function(req, res) {
  console.log("Deck Submission Start");

  var title = req.body["title"];
  if (!title)
    title = "No Title";

  var query = {
    mainDeck: req.body["mainDeck"],
    mainDeckInfo: req.body["mainDeckInfo"],
    mainDeckCount: req.body["mainDeckCount"],
    eggDeck: req.body["eggDeck"],
    eggDeckInfo: req.body["eggDeckInfo"],
    eggDeckCount: req.body["eggDeckCount"],
    status: req.body["status"],
    title: title,
    privacy: req.body["privacy"],
    user: req.body["user"]
  };
  query["creation"] = new Date();
  query["update"] = new Date();

  pool.collection("decks").insertOne(query, (error, result) => {
    if (error)
      return res.status(500).json({success: false, message: "Insert error: " + error})
    else
      return res.json({success: true, message: "Insert Complete"})
  });

});

/**
 * POST /decks/update
 * Creates new deck
 */
router.post('/update', async function(req, res) {
  console.log("Deck Update Start");

  var title = req.body["title"];
  if (!title)
    title = "No Title";

  var query = {
    mainDeck: req.body["mainDeck"],
    mainDeckInfo: req.body["mainDeckInfo"],
    mainDeckCount: req.body["mainDeckCount"],
    eggDeck: req.body["eggDeck"],
    eggDeckInfo: req.body["eggDeckInfo"],
    eggDeckCount: req.body["eggDeckCount"],
    status: req.body["status"],
    title: title,
    privacy: req.body["privacy"],
    user: req.body["user"]
  };
  var creation = Date.parse(req.body['creation']);
  creation = new Date(creation);
  query["creation"] = creation;
  query["update"] = new Date();

  pool.collection("decks").update({_id: new ObjectID(req.body["_id"])}, query, (error, result) => {
    if (error)
      return res.status(500).json({success: false, message: "Insert error: " + error});
    else
      return res.json({success: true, message: "Insert Complete"});
  });

});

module.exports = router;
