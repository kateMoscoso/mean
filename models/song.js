'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    number : String,
    name: String,
    duration: String,
    file: String,
    album: {type : Schema.ObjectId, ref: 'Album' }
});
//album: {type : Schema.ObjectId, ref: 'Album' } guardar id de otro objeto
//import the element
module.exports = mongoose.model('Song', SongSchema);