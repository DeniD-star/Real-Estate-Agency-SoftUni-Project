const Housing = require('../models/Housing');


async function getLatestHousings(size){
    let sort = {createdAt: -1}
    return Housing
    .find({})
    .sort(sort)
    .limit(size)
    .lean();
}

module.exports = {
    getLatestHousings
}