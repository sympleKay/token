
//Dependencies
const mongoose = require('mongoose');

//Use Schema
const Schema = mongoose.Schema;

//Create a book schema
const bookSchema = new Schema ({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    page: {
        type: Number,
        required: true
    }
}, {timestamps: true})

//model on userSchema
let Book = mongoose.model('Book', bookSchema);

//export model
module.exports = Book;