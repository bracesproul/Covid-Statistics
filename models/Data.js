const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    country: {
        type: String,
        //required: [true, 'country not added'],
    },
    infected: {
        type: String,
        //required: [true, 'infected not added'],
    },
    deceased: {
        type: String,
        //required: [true, 'deceased not added'],
    },
    date: {
        type: String,
        //required: [true, 'date not added'],
    }
});

module.exports = mongoose.models.Data || mongoose.model('Data', DataSchema);