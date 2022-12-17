const Housing = require('../models/Housing');


async function getLatestHousings(size){
    let sort = {createdAt: -1}
    return Housing
    .find({})
    .sort(sort)
    .limit(size)
    .lean();
}

async function getAllHousings(){
        return Housing.find({}).lean();

        
}
async function createHousing(housingData){
    const housing= new Housing(housingData);
    return housing.save();

        
}


async function getHousingById(id){
    return Housing.findById(id).populate('rentedHome').lean()
}

async function editHousing(housingId, newData){
        const housing = await Housing.findById(housingId);
        housing.name = newData.name;
        housing.type = newData.type;
        housing.year = Number(newData.year);
        housing.city = newData.city;
        housing.imageUrl = newData.imageUrl;
        housing.description = newData.description;
        housing.availablePieces = Number(newData.availablePieces);

        return housing.save();
}

async function deleteHousing(id){
    return Housing.findByIdAndDelete(id);
}

async function rentHousing(housingId, userId){
        const housing = await Housing.findById(housingId);
        housing.rentedHome.push(userId);
        housing.availablePieces--;

        return housing.save()

}
module.exports = {
    getLatestHousings,
    getAllHousings,
    createHousing,
    getHousingById,
    editHousing,
    deleteHousing,
    rentHousing
}