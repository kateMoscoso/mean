'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean_db', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('connected');

        app.listen(port, function() {
            console.log("Servidor esccuchando por el puerto: " + port);
        });
    }
});