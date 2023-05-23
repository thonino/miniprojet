// Mongodb et Mongoose :
const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    expediteur: { type: String },
    destinataire: { type: String },
    message: { type: String }
});

module.exports = mongoose.model('Chat', chatSchema);

