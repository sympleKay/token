const express = require ('express');
const bcrypt = require ('bcryptjs');
const bodyParser = require ('body-parser');
const jwt = require('jsonwebtoken');
const fs = require ('fs');
const mongoose = require('mongoose');
const User = require ('./model/user');
const User = require ('./model/books');
const app = express();

const MONGOURI = 'mongodb://127.0.0.1:27017/token';

//create connection
let openDBConnection = () => {
    mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false } );

    //see if connection was successful or throw error
    let db = mongoose.connection;
    db.on('error', (err) => {
        console.error(err);
    })
    db.once('open', () => {
        console.log(`Connection to mongoDB successful....`)
    })
}

openDBConnection ();

const urlencoded = bodyParser.urlencoded( { extended: false } )

//require passport auth
require('./config/passport');


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

let PORT = 3000 || process.env.PORT;

app.post('/register', urlencoded, async (req, res) => {
    try {
        //error messages
        let errors = [];

        //destructure body 
        const {username, password} = req.body;

        //Check if empty
        if (!error || !password) {
            errors.push({msg: 'Both fields are required'});
        }
        //Create new user
        const newUser = new User;
                newUser.username = username;
                newUser.password = password;
                //hash password
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {throw err}
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {throw err}
                        newUser.password = hash;
                        //save to DB
                        newUser.save((err) => {
                            if (err) {
                                throw err;
                            } else {
                                req.flash('error', 'Registration successful, log in');
                                res.redirect('/login');
                            }
                        })
                    })
                })
    } catch (error) {
        console.log(err);
        res.render('error/500')
    }
})

//login endpoint
app.post('/login', urlencoded, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }) (req, res, next);
})

app.get('/print', (req, res) => {
    if(!req.user) {
        console.log('You need to be login');
    } else {
        jw
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
