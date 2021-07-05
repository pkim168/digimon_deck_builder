const express = require('express')
const router = express.Router()
const pool = require('../controllers/mysqlpool')
const tokenvalidator = require('../controllers/tokenvalidator')
const app = require('../index')

// Verify JWT above all else.
router.use(tokenvalidator)

/**
 * GET /user/
 * Returns every possible user. Requires x-access-token/JWT.
 */
router.get('/', (req, res) => {
    if (req.token.userRole === "Administrator") {
        pool.query("SELECT userID, userRole, userName, emailAddress, firstName, lastName, banned FROM users JOIN userRoles ON (users.userRoleID = userRoles.userRoleID) ORDER BY lastName ASC, firstName ASC, userName ASC", (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, data: results})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * GET /user/me
 * Returns user information from token
 */
router.get('/me', (req, res) => {
    var data = {
        userID: req.token.userId,
        firstName: req.token.firstName,
        lastName: req.token.lastName,
        userRole: req.token.userRole
    }
    
    res.json({success: true, data: data})
})

/**
 * GET /user/roles
 * Will return every role stored in the database
 */
router.get('/roles', (req, res) => {
    if (req.token.userRole === "Administrator") {
        pool.query("SELECT * FROM userRoles", (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, data: results})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * POST /user/roles
 * Will insert a new role
 * Expects userRole (value used for validation), notes (description for future admins)
 */
router.post('/roles', (req, res) => {
    const userRole = req.body.userRole
    var notes = req.body.notes

    if (!userRole || userRole === "") {
        return res.json({success: false, message: "Expected field userRole"})
    }

    if (!notes || notes === "") {
        notes = null
    }

    if (req.token.userRole === "Administrator") {
        pool.query("INSERT INTO userRoles (userRole, notes) VALUES (?, ?)", [userRole, notes], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, message: "Role added successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * POST /user/roles/:roleID
 * Edits a role
 * Expects userRole (value used for validation), notes (description for future admins)
 */
router.post('/roles/:roleID', (req, res) => {
    const userRole = req.body.userRole
    var notes = req.body.notes

    if (!userRole || userRole === "") {
        return res.json({success: false, message: "Expected field userRole"})
    }

    if (!notes || notes === "") {
        notes = null
    }

    if (req.token.userRole === "Administrator") {
        pool.query("UPDATE userRoles SET userRole = ?, notes = ? WHERE userRoleID = ?", [userRole, notes, req.params.roleID], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, message: "Role edited successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * DELETE /user/roles/:roleID
 * Removes a role
 */
router.delete('/roles/:roleID', (req, res) => {
    if (req.token.userRole === "Administrator") {
        pool.query("DELETE FROM userRoles WHERE userRoleID = ?", [req.params.roleID], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, message: "Role deleted successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * GET /user/flagged
 * Returns a list of every flagged review
 */
router.get('/flagged', (req, res) => {
    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("SELECT movieReviews.movieID, title, movieReviews.userID, userName, date, rating, review, approved, spoiler FROM movieReviews JOIN movies ON (movieReviews.movieID = movies.movieID) JOIN users ON (users.userID = movieReviews.userID) WHERE flag = ?", [true], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, data: results})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * DELETE /user/flagged
 * Clears every single flag in the movieReviews table
 */
router.delete('/flagged', (req, res) => {
    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("UPDATE movieReviews SET flag = ?", [false], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, message: "Every flag was cleared successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * DELETE /user/flagged/:movieID/:userID
 * Clears a flag on a particular review
 */
router.delete('/flagged/:movieID/:userID', (req, res) => {
    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("UPDATE movieReviews SET flag = ? WHERE movieID = ? AND userID = ?", [false, req.params.movieID, req.params.userID], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})
            res.json({success: true, message: "Flag cleared successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * GET /user/:userID
 * Returns information on a user, and any reviews they posted
 */
router.get('/:userID', (req, res) => {
    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("SELECT userID, userRole, userName, emailAddress, firstName, lastName, banned FROM users JOIN userRoles ON (users.userRoleID = userRoles.userRoleID) WHERE userID = ?", [req.params.userID], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})

            var data = results

            if (data.length != 0) {

                pool.query("SELECT movieReviews.movieID, title, date, rating, review FROM movieReviews JOIN movies ON (movieReviews.movieID = movies.movieID) WHERE userID = ? ORDER BY date DESC", [req.params.userID], (error, results, fields) => {
                    if (error) return res.json({success: false, message: error})
                    res.json({success: true, data: data, reviews: results})
                })
            } else {
                res.json({success: false, message: "UserID does not exist."})
            }
            
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * POST /user/:userID
 * Edit's a user's emailAddress, firstName, lastName, password, banned
 * Expects: emailAddress, firstname, lastname, banned
 */
router.post('/:userID', (req, res) => {
    const emailAddress = req.body.emailAddress
    const firstName = req.body.firstname
    const lastName = req.body.lastname
    const banned = req.body.banned

    if (!emailAddress || emailAddress === "") {
        return res.json({success: false, message: "Expected field emailAddress"})
    }
    
    if (!firstName || firstName === "") {
        return res.json({success: false, message: "Expected field firstname"})
    }
    
    if (!lastName || lastName === "") {
        return res.json({success: false, message: "Expected field lastname"})
    }

    if (!banned || banned === "") {
        return res.json({success: false, message: "Expected field username."})
    }

    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("UPDATE users SET emailAddress=?, firstName=?, lastName=?, banned=? WHERE userID=?", [emailAddress, firstName, lastName, banned, req.params.userID], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})

            res.json({success: true, message: "User updated successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

/**
 * POST /user/:userID/:movieID
 * Edit's a user's review, sets approved, spoiler and flag status
 * Expects: review, approved, flag
 */
router.post('/:userID/:movieID', (req, res) => {
    const review = req.body.review
    const approved = req.body.approved
    const flag = req.body.flag

    if (!review || review === "") {
        return res.json({success: false, message: "Expected field review"})
    }

    if (!approved || approved === "") {
        return res.json({success: false, message: "Expected field approved"})
    }

    if (!flag || flag === "") {
        return res.json({success: false, message: "Expected field flag"})
    }

    if (req.token.userRole === "User Moderator" || req.token.userRole === "Administrator") {
        pool.query("UPDATE movieReviews SET review=?, approved=?, flag=? WHERE movieID=? AND userID=?", [review, approved, flag], (error, results, fields) => {
            if (error) return res.json({success: false, message: error})

            res.json({success: true, message: "User's review updated successfully"})
        })
    } else {
        res.json({success: false, message: "You do not have permission to view this. Please contact an administrator to fix this."})
    }
})

module.exports = router