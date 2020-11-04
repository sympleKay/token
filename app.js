const express = require ('express');
const bcrypt = require ('bcryptjs');
const bodyParser = require ('body-parser');
const random = require('randomatic');
const fs = require ('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require ('./model/user');
const Book = require ('./model/books');
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

function ensureAuth (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

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
        res.status(500).send('Server error');
    }
})

//login endpoint
app.post('/login', urlencoded, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/member/dashboard',
        failureRedirect: '/member/login',
        failureFlash: true
    }) (req, res, next);
})


app.get('/print',  urlencoded, (req, res) => {
    let pages = 50;
    let token = [];
    for (let i = 1; i <= pages; i++) {
        let randomNum = random('0', 6);
        token.push(randomNum);
    }
    console.log(token, token.length);
    fs.writeFile('./token.csv', token, (err, doc) => {
        if (err) {
            throw err;
        } else {
            console.log(doc);
        }
    })
    res.send(token);
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
