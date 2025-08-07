const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    type: {
        type: String
    },
    text :{
        type: String
    },
})

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;