const mongoCollections = require('../config/mongoCollections');
const buildings = mongoCollections.buildings;
const users = mongoCollections.users;
const buildingCodes = require("./buildingCodes")
const data = require('../data')
const userFunctions = data.users
const { ObjectId } = require("mongodb");

async function createBuilding(name, buildingCode, xp, xpMax, level, user) {
    //Check Arguments
    if (arguments.length !== 6) throw 'You must provide 6 arguments for your building (name,buildingCode,xp,xpMax,level,user)';
    if (!buildingCode) throw 'You must provide a buildingCode for your building';
    // if (!xp) throw 'You must provide an xp for your building';
    if (!xpMax) throw 'You must provide an xpMax for your building';
    if (!level) throw 'You must provide an level for your building';

    //Check Building Code
    if (typeof buildingCode !== 'string') throw 'buildingCode must be a string';
    buildingCode = buildingCode.trim();
    if (buildingCode.length === 0) throw 'buildingCode must not be empty';
    if (!buildingCodes.isValidBuildingCode(buildingCode)) throw 'buildingCode must be a valid buildingCode';

    //Check XP
    if (typeof xp !== 'number' && typeof xp !== 'string') throw 'xp must be a number or string';
    if (xp < 0) throw 'xp must be a positive number';

    //Check XP Max
    if (typeof xpMax !== 'number' && typeof xpMax !== 'string') throw 'xpMax must be a number';
    if (typeof xpMax === 'string' && isNaN(Number(xpMax))) throw 'xpMax must be a number (given as a string)'
    xpMax = Number(xpMax);
    if (xpMax < 0) throw 'xpMax must be a positive number';

    //Check Level
    if (typeof level !== 'number' && typeof level !== 'string') throw 'level must be a number';
    if (typeof level === 'string' && isNaN(Number(level))) throw 'level must be a number (given as a string)'
    level = Number(level);
    if (level < 0 || level > 3) throw 'level must be either 1, 2, or 3';

    //Check User
    if (typeof user !== 'string') throw 'user must be a string';
    user = user.trim();
    user = user.toLowerCase();
    if (user.length === 0) throw 'user must not be empty';


    const buildingCollection = await buildings();
    const newBuilding = {
        name: name,
        buildingCode: buildingCode,
        xp: xp,
        xpMax: xpMax,
        level: level,
        Avatar: 'NONE',
        Tasks: []
    };

    const newInsertInformation = await buildingCollection.insertOne(newBuilding);
    if (newInsertInformation.insertedCount === 0) throw 'Could not add building';
    const newId = newInsertInformation.insertedId;

    const userCollection = await users(); //Initializing User Collection Variable

    //check if username is within database
    const foundUser = await userCollection.findOne({ email: user });

    if (!foundUser) {
        throw 'Error: User not found!'
    }

    const userEntry = { buildingID: newId, name: name, code: buildingCode };

    const update = await userCollection.updateOne(
        { _id: ObjectId(foundUser._id) },
        { $addToSet: { buildings: userEntry } }
    )

    if (!update.matchedCount && !update.modifiedCount) {
        throw 'AddBuildings: Update failed';
    }


    const building = await this.getBuilding(newId.toString());
    console.log('i made it')
    return building;
}

async function completeTask(buildingId) {
    if (!buildingId) throw 'You must provide an id to search for';
    if (typeof buildingId !== 'string') throw 'id must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'id must be a valid ObjectId';
    const new_buildingId = buildingId.trim().toLowerCase();
    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(new_buildingId) });
    if (building === null) throw 'No building with that id';

    let new_xpMax;
    let new_level;
    let new_xp = building.xp + 10;
    if (new_xp >= building.xpMax) {
        new_xp = new_xp - building.xpMax;
        new_xpMax = building.xpMax * 2;
        new_level = building.level + 1;
        if (new_level > 3) {
            new_level = 3;
            new_xp = building.xpMax;
        }
    } else {
        new_xpMax = building.xpMax;
        new_level = building.level;
    }
    const updatedBuilding = {
        _id: building._id,
        buildingCode: building.buildingCode,
        xp: new_xp,
        xpMax: new_xpMax,
        level: new_level,
        Avatar: building.Avatar,
        Tasks: building.Tasks
    };
    const update = await buildingCollection.replaceOne(
        { _id: ObjectId(new_buildingId) },
        updatedBuilding
    )

    if (update.modifiedCount === 0) {
        throw 'CompleteTask: Update failed';
    }

    return await this.getBuilding(new_buildingId);
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

    console.log('deleteBuilding DATA FUNCTION: ' + id);
    const buildingCollection = await buildings();
    const deletionInfoBuilding = await buildingCollection.findOneAndDelete({ _id: ObjectId(id) });
    if (deletionInfoBuilding.deletedCount === 0) {
        throw `Could not delete building with id of ${id}`;
    }
    const userCollection = await users();
    const deletionInfoUser = await userCollection.updateOne( //Delete Building from User
        { buildings: { $elemMatch: { buildingID: ObjectId(id) } } },
        { $pull: { buildings: { buildingID: ObjectId(id) } } }
    )
    if (!deletionInfoUser.matchedCount && !deletionInfoUser.modifiedCount) {
        throw 'DeleteBuilding: Update failed';
    }

    return true;
}

async function getAllBuildings() {
    const buildingCollection = await buildings();
    try {
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

    // foundUser.buildings.forEach(element => {
    //     element = element.toString();
    // })
    return foundUser.buildings
}

async function addAvatarToBuilding(buildingId, avatarId) {
    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });

    // const updatedBuilding = {

    // }

    const updatedInfo = await buildingCollection.updateOne(
        { _id: ObjectId(buildingId) },
        { $set: { Avatar: avatarId } });

    if (building == null) throw 'Error: Building not found';

    console.log('added successfully')
    return;
}

module.exports = {
    createBuilding,
    getBuilding,
    updateBuilding,
    deleteBuilding,
    getAllBuildings,
    getUserBuildings,
    completeTask,
    addAvatarToBuilding
};