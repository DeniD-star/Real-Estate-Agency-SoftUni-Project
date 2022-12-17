const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, minLength: [6, 'Name hast to be at least 6 characters long!']},
    type: { type: String, required: true, enum: ["Apartment", "Villa", "House"] },
    year: { type: Number, required: [true, 'Year is required!'] , min: [1850, 'NOt less than 1850!'], max: [2021, 'Not over 2021!']},
    city: { type: String, minLength: [4, 'City hast to be at least 4 characters long!'] },
    imageUrl: { type: String, required: true, match: [/^https?/, 'Image must be a valid URL!'] },
    description: { type: String, required: [true , 'Description is required!'], maxLength: [60, 'Description hast to be not over 60 characters long!']},
    availablePieces: { type: Number, min: [0, 'Available Pieces should be positive number !'], max: [10, 'Available Pieces should be positive number !'] },
    rentedHome: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },

})

module.exports = model('Housing', schema);