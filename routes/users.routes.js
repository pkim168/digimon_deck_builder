const express = require('express')
const router = express.Router()
const mongodbpool = require('../controllers/mongodbpool')
const app = require('../app')
const tokenvalidator = require('../controllers/tokenvalidator')
var pool = mongodbpool.getDb();
var cors = require('cors');

// Verify JWT above all else.
router.use(tokenvalidator)
router.options('/*', cors({ allowedHeaders: 'x-access-token'}));

// router.options('/you', cors(), function(req, res, next) {
//
//   res.append('Access-Control-Expose-Headers', 'X-Total-Count');
//   res.send('Option Accepted');
// });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * GET /users/me
 * Returns user information from token
 */
router.get('/me', (req, res) => {
    var data = [{
        id: req.token._id,
        email: req.token.email,
        username: req.token.username,
        firstName: req.token.firstName,
        lastName: req.token.lastName,
        role: req.token.role,
        creation: req.token.creation
    }];
    res.append('Access-Control-Expose-Headers', 'X-Total-Count');
    res.append("X-Total-Count", "1");
    res.json(data);
})

router.get('/you', cors(), (req, res) => {
    var data = [{
        id: 0,
        email: "pkim168@gmail.com",
        firstName: "Paul",
        lastName: "Kim",
    }, {
        id: 1,
        email: "pkim168@gmail.com",
        firstName: "Paul",
        lastName: "Kim",
    }];
    res.append('Access-Control-Expose-Headers', 'X-Total-Count');
    res.append("X-Total-Count", "2");
    res.json(data);
})

module.exports = router;
