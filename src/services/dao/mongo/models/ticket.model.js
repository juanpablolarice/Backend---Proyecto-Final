const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    code: {
        type: String,
        default: Date.now
    },
    purchaser_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        max: 100,
    },
}, { versionKey: false });

const Ticket = mongoose.model('ticket', TicketSchema);

module.exports = Ticket;