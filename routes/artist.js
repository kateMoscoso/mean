'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var api = express.Router(); //router de express
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

//middlerware en la segunda variable
api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);


module.exports = api;