'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (artist) {
                res.status(200).send({ artist });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })
}

function getArtists(req, res) {
    var page = req.params.page || 1;
    var itemsPerPage = 3;
    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (artists) {
                res.status(200).send({ total: total, artists: artists });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })
}


function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;
    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error saving the artist' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'The artist cannot be storaged' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    });

}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (artistUpdated) {
                res.status(200).send({ artist: artistUpdated });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })
}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (artistRemoved) {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Request error' });
                    } else {
                        if (albumRemoved) {
                            Song.find({ artist: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Request error' });
                                } else {
                                    if (songRemoved) {
                                        res.status(200).send({ artist: artistRemoved });
                                    } else {
                                        res.status(404).send({ message: 'The song cannot be removed' });
                                    }
                                }
                            });
                        } else {
                            res.status(404).send({ message: 'The album cannot be removed' });
                        }

                    }
                });
            } else {
                res.status(404).send({ message: 'The artist cannot be removed' });
            }

        }
    })
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'no subido';
    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error updating artist image' });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: 'Artist cannot be updated' });
                    } else {
                        res.status(200).send({ artist: artistUpdated });
                    }
                }
            })
        } else {
            res.status(200).send({ message: 'File extension must be .png, .jpg or gif' });
        }

    } else {
        res.status(200).send({ message: 'There is no image uploaded' });

    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'File does not exist' });
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile

};