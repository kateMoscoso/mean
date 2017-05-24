'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year : Number,
    image: String,
    artist: {type : Schema.ObjectId, ref: 'Artist' }
});
//artist: {type : Schema.ObjectId, ref: 'Artist' } guardar id de otro objeto
//import the element
module.exports = mongoose.model('Album', AlbumSchema);