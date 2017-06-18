'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas (req, res) {
    res.status(200).send({
        message: 'Testing user controller action'
    });
}
function saveUser(req, res){
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = params.role;
    user.image = null;

    if(params.password){

    bcrypt.hash(params.password, null, null, function(err,hash){
        user.password = hash;
        if(user.name != null && user.surname != null && user.email != null){
            user.save((err,userStored) => {
                if(err){
                    res.status(500).send({ message :'Error to save the user'});
                }else {
                    if(!userStored){
                        res.status(404).send({ message :'Error not saved'});

                    }else{
                        res.status(200).send({user : userStored});

                    }
                }
            });
        }else{
            res.status(200).send({ message :'name, surname and email fields are required'});
        }
    });
    }else{
        res.status(200).send({ message :'Password is required'});
    }

};
function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;
    User.findOne({emai: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message : 'Request error'})
        }
        else{
            if(!user){
                res.status(404).send({message:'User does not exist'});
            }else {
                //Check password
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.gethashs){
                            res.status(200).send({token: jwt.createToken(user)});
                        }
                        else{
                            res.status(200).send({user});
                        }
                    }else {
                        res.status(404).send({message:'User cannot connect'});
                    }
                })
            }
        }
    });
}
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated)=> {
        if(err){
            res.status(500).send({message:'Error updating user'});
        }else {
            if(!userUpdated){
                res.status(404).send({message:'User cannot be updated'});
            }
            else{
                res.status(200).send({user: userUpdated});
            }
        }
    });

}

//exportar con un modulo
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser
};