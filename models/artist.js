'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

//import the element
module.exports = mongoose.model('Artist', ArtistSchema);