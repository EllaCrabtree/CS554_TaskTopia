const mongoCollections = require('../config/mongoCollections');
const buildings = mongoCollections.buildings;
const users = mongoCollections.users;
const buildingCodes = require("./buildingCodes")
const { ObjectId } = require("mongodb");

async function createBuilding(buildingCode, xp, xpMax, level) {
    //Check Arguments
    if (arguments.length !== 4) throw 'You must provide 4 arguments for your building (buildingCode,xp,xpMax,level)';
    if (!buildingCode) throw 'You must provide a buildingCode for your building';
    if (!xp) throw 'You must provide an xp for your building';
    if (!xpMax) throw 'You must provide an xpMax for your building';
    if (!level) throw 'You must provide an level for your building';

    //Check Building Code
    if (typeof buildingCode !== 'string') throw 'buildingCode must be a string';
    buildingCode = buildingCode.trim();
    if (buildingCode.length === 0) throw 'buildingCode must not be empty';
    if (!buildingCodes.isValidBuildingCode(buildingCode)) throw 'buildingCode must be a valid buildingCode';

    //Check XP
    if (typeof xp !== 'number') throw 'xp must be a number';
    if (xp < 0) throw 'xp must be a positive number';

    //Check XP Max
    if (typeof xpMax !== 'number') throw 'xpMax must be a number';
    if (xpMax < 0) throw 'xpMax must be a positive number';

    //Check Level
    if (typeof level !== 'number') throw 'level must be a number';
    if (level < 0 || level > 3) throw 'level must be either 1, 2, or 3';

    const buildingCollection = await buildings();
    const newBuilding = {
        buildingCode: buildingCode,
        xp: xp,
        xpMax: xpMax,
        level: level,
        Avatar: [],
        Tasks: []
    };
    const newInsertInformation = await buildingCollection.insertOne(newBuilding);
    if (newInsertInformation.insertedCount === 0) throw 'Could not add building';
    const newId = newInsertInformation.insertedId;

    const building = await this.getBuilding(newId.toString());
    return building;
}

async function getBuilding(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(id) });
    if (building === null) throw 'No building with that id';

    building._id = building._id.toString();
    return building;
}

async function updateBuilding(id, buildingCode, xp, xpMax, level, Avatar, Tasks) {
    //Check Arguments
    if (arguments.length !== 7) throw 'You must provide 7 arguments for your building (id,buildingCode,xp,xpMax,level,Avatar,Tasks)';
    if (!id) throw 'You must provide an id for your building';
    if (!buildingCode) throw 'You must provide a buildingCode for your building';
    if (!xp) throw 'You must provide an xp for your building';
    if (!xpMax) throw 'You must provide an xpMax for your building';
    if (!level) throw 'You must provide an level for your building';
    if (!Avatar) throw 'You must provide an Avatar for your building';
    if (!Tasks) throw 'You must provide an Tasks for your building';

    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    //Check Building Code
    if (typeof buildingCode !== 'string') throw 'buildingCode must be a string';
    buildingCode = buildingCode.trim();
    if (buildingCode.length === 0) throw 'buildingCode must not be empty';
    if (!buildingCodes.isValidBuildingCode(buildingCode)) throw 'buildingCode must be a valid buildingCode';

    //Check XP
    if (typeof xp !== 'number') throw 'xp must be a number';
    if (xp < 0) throw 'xp must be a positive number';

    //Check XP Max
    if (typeof xpMax !== 'number') throw 'xpMax must be a number';
    if (xpMax < 0) throw 'xpMax must be a positive number';

    //Check Level
    if (typeof level !== 'number') throw 'level must be a number';
    if (level < 0) throw 'level must be a positive number';

    //Check Avatar [TODO]
    if (typeof Avatar !== 'object') throw 'Avatar must be an object';
    if (!Array.isArray(Avatar)) throw 'Avatar must be an array';
    //Check Tasks [TODO]
    if (typeof Tasks !== 'object') throw 'Tasks must be an object';
    if (!Array.isArray(Tasks)) throw 'Tasks must be an array';

    const buildingCollection = await buildings();
    const updatedBuilding = {
        _id: id,
        buildingCode: buildingCode,
        xp: xp,
        xpMax: xpMax,
        level: level,
        Avatar: Avatar,
        Tasks: Tasks
    };

    const updatedInfo = await buildingCollection.replaceOne({ _id: ObjectId(id) }, updatedBuilding);
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update building successfully';
    }

    return await this.getBuilding(id);
}

async function deleteBuilding(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    const buildingCollection = await buildings();
    const deletionInfo = await buildingCollection.removeOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete building with id of ${id}`;
    }
}

async function getAllBuildings() {
    const buildingCollection = await buildings();
    try{
        const buildings = await buildingCollection.find({}).toArray();
        return buildings;
    } catch (e) {
        console.log(e);
        throw e;
    }
    
}

async function getUserBuildings(username) {
    if (arguments.length != 1) throw 'Error: Invalid number of arguments for getUserBuildings!'
    if (!username) throw 'Error: Username not supplied!'
    if (typeof username !== 'string') throw 'Error: Username must be a string!'
    if (username.trim().length === 0) throw 'Error: Username cannot be empty or only spaces!'
    const new_username = username.trim().toLowerCase();

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: new_username });

    if (!foundUser) throw 'Error: User not found!';


    foundUser.buildings.forEach(element => {
        element = element.toString();
    })
    return foundUser.buildings
}

module.exports = {
    createBuilding,
    getBuilding,
    updateBuilding,
    deleteBuilding,
    getAllBuildings,
    getUserBuildings
};