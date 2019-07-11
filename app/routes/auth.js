"use strict"
const config = require('/usr/src/config/environments.js').config();
const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;

/**
 * @api {post} /api/v1/login Request Token
 * @apiName PostLogin
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username unique ID.
 * @apiParam {String} password Password associated with the username account.
 *
 * @apiSuccess {JSON} token Token access.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *{
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZWdvIiwiaWF0IjoxNTYwMzQzMDk5fQ.9xHv04cJFLcOKRaDCwRP6FLKQj2rHfXKQskAMJx-NjA"
 *}
 *
 * @apiError NotAuthorized Invalid password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error": "Invalid password"
 *     }
 */
router.post('', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    MongoClient.connect("mongodb://" + config.MONGODB.HOST + ":" + config.MONGODB.PORT + "/",{ useNewUrlParser: true }, function(err, db) {
        if (err) {
           res.status(400).send(err); 
        }
        else {
            db.db(config.MONGODB.DB_NAME).collection("users").find({username: req.body.username}).project({"password": true}).toArray(function(err, resp)  {
                db.close();
                if (err) {
                    
                    res.status(400).send(err); 
                }
                else {
                    try {
                        if (resp[0].password !== password) {
                            res.status(401).send({error: 'Invalid password'});
                        }
                        else {
                            const token = jwt.sign({"username": username}, process.env.SECRET_WORD);
                            res.status(200).json({token});
                        }
                    } catch {
                        res.status(401).send({error: 'User not found'});
                    }
                }
            }); 
        }
    });
});

router.verifyToken = function(req, res, next) {
    var token = req.headers['authorization'];
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        });
        return;
    }
    token = token.replace('Bearer ', '');

    jwt.verify(token, process.env.SECRET_WORD, function(err, decoded) {
        if(err) {
            res.status(401).send({error: 'Token inválido'})
        }
        else {
            res.locals.username = decoded.username;
            next();
        }
    });
}

module.exports = router;