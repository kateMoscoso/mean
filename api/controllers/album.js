'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (album) {
                res.status(200).send({ album });
            } else {
                res.status(404).send({ message: 'Album not found' });
            }

        }
    })
}

function getAlbums(req, res) {
    //var page = req.params.page || 1;
    var itemsPerPage = 3;
    var artistId = req.params.artist;
    var find = artistId ? Album.find({ artist: artistId }).sort('year') : Album.find().sort('title');

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (albums) {
                res.status(200).send({ albums: albums });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })

}


function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist; // id artist
    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Server error' });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'The album cannot be storaged' });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });

}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {
            if (albumUpdated) {
                res.status(200).send({ album: albumUpdated });
            } else {
                res.status(404).send({ message: 'Not found' });
            }

        }
    })
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Request error' });
        } else {

            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                if (err) {
                    res.status(500).send({ message: 'Request error' });
                } else {
                    if (songRemoved) {
                        res.status(200).send({ album: albumRemoved });
                    } else {
                        res.status(404).send({ message: 'The song cannot be removed' });
                    }
                }
            });

        }
    });
}





function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'no subido';
    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error updating album image' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'Album cannot be updated' });
                    } else {
                        res.status(200).send({ album: albumUpdated });
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
    var path_file = './uploads/albums/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'File does not exist' });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile

};