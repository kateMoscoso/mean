'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Header auth is required'})
    }
    var token = req.headers.authorization.replace(/['"]+g/, '');
    try {
        var pàyload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(404).send({message: 'Token expired'})

        }
    }catch(ex){
        console.log(ex);
        return res.status(404).send({message: 'Token invalid'})

    }
    req.user = payload;

    next();

};