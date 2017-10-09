'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (song) {
                res.status(200).send({ song });
            } else {
                res.status(404).send({ message: 'Song not found' });
            }

        }
    })
}

function getSongs(req, res) {
    var albumId = req.params.album;
    var find = albumId ? Song.find({ album: albumId }).sort('number') : Song.find().sort('number');

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (songs) {
                res.status(200).send({ songs: songs });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })

}


function saveSong(req, res) {
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album; // id artist
    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'Server error' });
        } else {
            if (!songStored) {
                res.status(404).send({ message: 'The song cannot be storaged' });
            } else {
                res.status(200).send({ song: songStored });
            }
        }
    });

}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;
    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (songUpdated) {
                res.status(200).send({ song: songUpdated });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })
}

function deleteSong(req, res) {
    var songId = req.params.id;
    var update = req.body;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (songRemoved) {
                res.status(200).send({ song: songRemoved });
            } else {
                res.status(404).send({ message: 'The song cannot be removed' });
            }


        }
    });
}





function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'no subido';
    if (req.files) {

        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext === 'mp3' || file_ext === 'ogg' || file_ext === 'wma') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error updating song image' });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: 'Song cannot be updated' });
                    } else {
                        res.status(200).send({ song: songUpdated });
                    }
                }
            })
        } else {
            res.status(200).send({ message: 'File extension must be .mp3 or .ogg ' });
        }

    } else {
        res.status(200).send({ message: 'There is no file uploaded' });

    }
}

function getFile(req, res) {
    var songFile = req.params.file;
    var path_file = './uploads/songs/' + songFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'File does not exist' });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile

};