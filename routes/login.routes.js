const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongodbpool = require('../controllers/mongodbpool');
const bcrypt = require('bcrypt');
const app = require('../app');
const tokenvalidator = require('../controllers/tokenvalidator');
const { body, validationResult } = require('express-validator');
var pool = mongodbpool.getDb();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var cors = require('cors');
const config = require('../config');

router.options('/*', cors({ allowedHeaders: 'x-access-token'}));

// Default route, displaying a welcome message.
router.get("/", (req, res) => {
  return res.json({message: "Digimon Deck Builder API. Consult the source for documentation."})
})

router.get("/checkAuth", tokenvalidator, (req, res) => {
  return res.json({success: true, message: "Authentication succeeded."})
})

router.post('/confirmation', (req, res) => {
  if (!req.body.token)
    return res.status(500).json({success: false, message: "Expected token"});

  // Query for email
  var query = { token: String(req.body.token) };
  pool.collection("tokens").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json([error]);

    if (results.length == 1) {
        // Send to user
        query = {verified: true};
        pool.collection("users").updateOne({email: results[0]["email"]}, {$set: query}, (error, result) => {
          if (error)
            return res.status(500).json({success: false, message: "Update error: " + error});
          else {
            pool.collection("tokens").deleteOne({token: String(req.body.token)}, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Delete error: " + error})
              else {
                return res.json({success: true, message: "Email verified!", data: true});
              }
            });
          }
        });
    } else {
      // Username not found
      return res.status(500).json({success: false, message: "Link has expired. Resend the confirmation email"});
    }
  })

})

/**
 * Help message for /login
 */
router.get('/login', (req, res) => {
  return res.json({message: "Send a POST here with: username, password. You will receive: jwt"})
})

/**
 * POST /login
 * Expects username, password
 * Will return a JWT
 */
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(500).json({message: "Expected field username."})
  }

  if (!password) {
    return res.status(500).json({message: "Expected field password."})
  }

  // Query for email
  var query = { email: String(email) };
  pool.collection("users").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json([error]);

    if (results.length == 1) {
      // Check if password matches
      bcrypt.compare(password, results[0].password, (error, val) => {
        // Passwords match
        if (val) {
          if(results[0].verified){
            // Create payload for token
            const payload = {
              _id: results[0]._id,
              email: results[0].email,
              username: results[0].username,
              firstName: results[0].firstName,
              lastName: results[0].lastName,
              role: results[0].role,
              creation: results[0].creation,
            }

            // Create token with payload
            var token = jwt.sign(payload, app.get("supersecret"), {
              expiresIn: 60*60*24 // expire in 24 hours
            });

            // Send to user
            return res.json({success: true, message: "Login succeeded!", token: token})
          } else{
            // Account not verified
            return res.status(500).json({success: false, message: "Account is not verified"})
          }

        } else {
          // Passwords don't match
          return res.status(500).json({message: "Wrong password."})
        }
      })
    } else {
      // Username not found
      return res.status(500).json({message: "Unknown email. Have you registered yet?"})
    }
  })
})

/**
 * Help message for /register
 */
router.get('/register', (req, res) => {
  return res.json({message: "Send a POST here with: username, firstName, lastName, emailAddress, password. You will receive: message"})
})

/**
 * POST /register
 * Expects firstName, lastName, email, and password.
 * Will register a user into the database.
 */
router.post('/register', [
  body('email').isEmail()
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({success:false, message: "Not a valid email" });
  }

  const firstName = String(req.body.firstName);
  const lastName = String(req.body.lastName);
  const username = String(req.body.username);
  const email = String(req.body.email);
  const password = String(req.body.password);

  if (!username) {
    return res.status(500).json({success: false, message: "Expected field username"})
  }
  if (!email) {
    return res.status(500).json({success: false, message: "Expected field email"})
  }

  var query = {email: email}
  pool.collection("users").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json({success: false, message: "Email query error: " + error})

    if (results.length == 0) {
      var query = {username: username}
      pool.collection("users").find(query).toArray((error, results) => {
        if (error)
          return res.status(500).json({success: false, message: "username query error: " + error})

        if (results.length == 0) {
          // Hash the password.
          bcrypt.hash(password, 10, (error, hash) => {
            if (error)
              return res.status(500).json({success: false, message: "Password hash error: " + error})

            // Insert into users
            query = {email: email, username: username, password: hash, firstName: firstName, lastName: lastName, role: 'user', creation: new Date(), verified: false}
            pool.collection("users").insertOne(query, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Insert error: " + error})
            })
          });

          /* Email Verification */
          query = {email: email, token: crypto.randomBytes(16).toString('hex'), type: "verification", created: new Date()};
          pool.collection("tokens").insertOne(query, (error, result) => {
            if (error)
              return res.status(500).json({success: false, message: "Token error: " + error})
            // Send Verification email
            const host = req.get('origin');
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: config.emailUser,
                pass: config.emailPassword
              }
            });
            var mailOptions = {
              to: email,
              subject: "DigiDecks Email Registration Confirmation",
              text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \n' + host + '\/confirmation\/' + query['token'] + '.\n'
          // };
            };
            transporter.sendMail(mailOptions, function (error) {
              if (error) {
                return res.status(500).json({ success: false, message: "Mail error: " + error });
              }

              return res.json({success: true, message: "Confirmation email has been sent to " + email + '.'});
            });
          });
        }
        else {
          // Username already exists
          return res.status(500).json({success: false, message: "Username already exists."})
        }
      })
    } else {
      // Email already exists
      return res.status(500).json({success: false, message: "Email already exists."})
    }
  })
})

router.post('/resend', [
  body('email').isEmail()
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({success: false, message: "Not a valid email" });
  }

  const email = String(req.body.email);

  if (!email) {
    return res.status(500).json({success: false, message: "Expected field email"})
  }

  var query = {email: email}
  pool.collection("users").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json({success: false, message: "Email query error: " + error})

    if (results.length > 0) {
      if (!results[0].verified) {
        var query = {email: email, type: "verification"};
        pool.collection("tokens").find(query).toArray((error, results) => {
          if (error)
            return res.status(500).json([error]);

          if (results.length > 0) {
            pool.collection("tokens").deleteOne({token: String(results[0].token)}, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Delete error: " + error})

              /* Email Verification */
              query = {email: email, token: crypto.randomBytes(16).toString('hex'), type: "verification", created: new Date()};
              pool.collection("tokens").insertOne(query, (error, result) => {
                if (error)
                  return res.status(500).json({success: false, message: "Token error: " + error})
                // Send Verification email
                const host = req.get('origin');
                var transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                    user: config.emailUser,
                    pass: config.emailPassword
                  }
                });
                var mailOptions = {
                  to: email,
                  subject: "DigiDecks Email Registration Confirmation",
                  text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \n' + host + '\/confirmation\/' + query['token'] + '.\n'
              // };
                };
                transporter.sendMail(mailOptions, function (error) {
                  if (error) {
                    return res.status(500).json({ success: false, message: "Mail error: " + error });
                  }

                  return res.json({success: true, message: "Confirmation email has been sent to " + email + '.'});
                });
              });
            });
          }
          else {
            /* Email Verification */
            query = {email: email, token: crypto.randomBytes(16).toString('hex'), type: "verification", created: new Date()};
            pool.collection("tokens").insertOne(query, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Token error: " + error})
              // Send Verification email
              const host = req.get('origin');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: config.emailUser,
                  pass: config.emailPassword
                }
              });
              var mailOptions = {
                to: email,
                subject: "DigiDecks Email Registration Confirmation",
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \n' + host + '\/confirmation\/' + query['token'] + '.\n'
            // };
              };
              transporter.sendMail(mailOptions, function (error) {
                if (error) {
                  return res.status(500).json({ success: false, message: "Mail error: " + error });
                }

                return res.json({success: true, message: "Confirmation email has been sent to " + email + '.'});
              });
            });
          }
        })
      } else {
        return res.status(500).json({success: false, message: "Account is already verified."});
      }
    } else {
      // Email doesn't exist
      return res.status(500).json({success: false, message: "Account does not exist."})
    }
  })
})

router.post('/reset', (req, res) => {
  if (!req.body.token)
    return res.status(500).json({success: false, message: "Expected token"});

  // Query for email
  var query = { token: String(req.body.token), type: "password" };
  pool.collection("tokens").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json([error]);

    if (results.length == 1) {
      var email = results[0].email;
      // Send to user
      var password = crypto.randomBytes(10).toString('hex');
      bcrypt.hash(password, 10, (error, hash) => {
        if (error)
          return res.status(500).json({success: false, message: "Password hash error: " + error})

        // Insert into users
        query = {password: hash};
        pool.collection("users").updateOne({email: results[0]["email"]}, {$set: query}, (error, result) => {
          if (error)
            return res.status(500).json({success: false, message: "Update error: " + error});
          else {
            pool.collection("tokens").deleteOne({token: String(req.body.token)}, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Delete error: " + error})
              // Send reset email
              const host = req.get('origin');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: config.emailUser,
                  pass: config.emailPassword
                }
              });
              var mailOptions = {
                to: email,
                subject: "DigiDecks Reset Password",
                text: 'Hello,\n\n' + 'Your password has been reset to: \n' + password + '.'
              };
              transporter.sendMail(mailOptions, function (error) {
                if (error) {
                  return res.status(500).json({ success: false, message: "Mail error: " + error });
                }

                return res.json({success: true, message: "Your new password has been sent to" + email + '.'});
              });
            });
          }
        });
      });
    } else {
      return res.status(500).json({success: false, message: "Link has expired. Resend the confirmation email"});
    }
  })
})

router.post('/sendReset', [
  body('email').isEmail()
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({success: false, message: "Not a valid email" });
  }

  const email = String(req.body.email);

  if (!email) {
    return res.status(500).json({success: false, message: "Expected field email"})
  }

  var query = {email: email}
  pool.collection("users").find(query).toArray((error, results) => {
    if (error)
      return res.status(500).json({success: false, message: "Email query error: " + error})

    if (results.length > 0) {
      var query = {email: email, type: "password"};
      pool.collection("tokens").find(query).toArray((error, results) => {
        if (error)
          return res.status(500).json([error]);

        if (results.length > 0) {
          pool.collection("tokens").deleteOne({token: String(results[0].token)}, (error, result) => {
            if (error)
              return res.status(500).json({success: false, message: "Delete error: " + error})

            // Reset Password
            query = {email: email, token: crypto.randomBytes(16).toString('hex'), type: "password", created: new Date()};
            pool.collection("tokens").insertOne(query, (error, result) => {
              if (error)
                return res.status(500).json({success: false, message: "Token error: " + error})
              // Send reset email
              const host = req.get('origin');
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: config.emailUser,
                  pass: config.emailPassword
                }
              });
              var mailOptions = {
                to: email,
                subject: "DigiDecks Reset Password",
                text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \n' + host + '\/reset\/' + query['token'] + '.\n If you do not wish to reset your password. Ignore this email.'
            // };
              };
              transporter.sendMail(mailOptions, function (error) {
                if (error) {
                  return res.status(500).json({ success: false, message: "Mail error: " + error });
                }

                return res.json({success: true, message: "Reset password email has been sent to " + email + '.'});
              });
            });
          });
        }
        else {
          // Reset Password
          query = {email: email, token: crypto.randomBytes(16).toString('hex'), type: "password", created: new Date()};
          pool.collection("tokens").insertOne(query, (error, result) => {
            if (error)
              return res.status(500).json({success: false, message: "Token error: " + error})
            // Send Verification email
            const host = req.get('origin');
            var transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: config.emailUser,
                pass: config.emailPassword
              }
            });
            var mailOptions = {
              to: email,
              subject: "DigiDecks Reset Password",
              text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \n' + host + '\/reset\/' + query['token'] + '.\n If you do not wish to reset your password. Ignore this email.'
          // };
            };
            transporter.sendMail(mailOptions, function (error) {
              if (error) {
                return res.status(500).json({ success: false, message: "Mail error: " + error });
              }

              return res.json({success: true, message: "Reset password email has been sent to " + email});
            });
          });
        }
      })
    } else {
      // Email doesn't exist
      return res.status(500).json({success: false, message: "Account does not exist."})
    }
  })
})

router.post('/update', [
  body('email').isEmail()
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({success:false, message: "Not a valid email" });
  }

  const email = String(req.body.email);
  const firstName = String(req.body.firstName);
  const lastName = String(req.body.lastName);
  const password = String(req.body.password);

  if (!email) {
    return res.status(500).json({success: false, message: "Expected field email"})
  }

  // Hash the password.
  if (password) {
    bcrypt.hash(password, 10, (error, hash) => {
      if (error)
        return res.status(500).json({success: false, message: "Password hash error: " + error})

      // Insert into users
      query = {firstName: firstName, lastName: lastName, password: hash};

      pool.collection("users").updateOne({email: email}, {$set: query}, (error, result) => {
        if (error)
          return res.status(500).json({success: false, message: "Update error: " + error});
        else
          return res.json({success: true, message: "Update Complete"});
      });
    });
  }
  else {
    // Insert into users
    query = {firstName: firstName, lastName: lastName};

    pool.collection("users").updateOne({email: email}, {$set: query}, (error, result) => {
      if (error)
        return res.status(500).json({success: false, message: "Update error: " + error});
      else
        return res.json({success: true, message: "Update Complete"});
    });
  }
})

module.exports = router
