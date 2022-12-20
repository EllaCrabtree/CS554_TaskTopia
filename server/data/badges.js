const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require("mongodb");

const badges = mongoCollections.badges;
const users = mongoCollections.users;
const buildings = mongoCollections.buildings;

const userData = require('./users');

/**
 * Adds badge to the database
 * 
 * @param {String (BuildingCode)} building 
 * @param {Int} ptsNeeded 
 * @param {String} description 
 * @param {String} type
 * @returns created badges
 */
async function createBadge(building, ptsNeeded, description, type) {
    if (arguments.length != 4) throw `Incorrect number of arguments passed to 'createBadge'`;
    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);

    if (ptsNeeded === null) throw `Points needed cannot be empty.`;
    if (typeof ptsNeeded != 'number') throw `Points needed must be a integer.`;

    if (!description) throw `Description cannot be empty.`;
    if (typeof description != 'string') throw `Description must be a string.`;
    description = String.prototype.trim.call(description);

    if (!type) throw `type cannot be empty.`;
    if (typeof type != 'string') throw `type must be a string.`;
    type = String.prototype.trim.call(type);

    const badgeCollection = await badges();

    let newbadge = {
        building: building,
        ptsNeeded: ptsNeeded,
        description: description,
        type: type
    }

    const insertInfo = await badgeCollection.insertOne(newbadge);
    if (insertInfo.insertedCount === 0) throw 'Could not add badge';

    const newId = insertInfo.insertedId.toString();

    const badge = await getBadge(newId);
    return badge;
}

/**
 * Gets the specified badge object from the database
 * 
 * @param {ObjectId} id 
 * @returns badge object
 */
async function getBadge(id) {
    if (arguments.length != 1) throw `Incorrect number of arguments passed to 'getBadge'`;
    if (!id) throw `Id cannot be empty.`;
    if (typeof id != 'string') throw `Id must be a string.`;
    id = String.prototype.trim.call(id);
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId`;

    const badgeCollection = await badges();

    const badge = await badgeCollection.findOne({ _id: ObjectId(id) });
    if (!badge) throw 'No badge with that id';

    badge._id = badge._id.toString();
    return badge;
}

/**
 * Gets all badges that are currently in the database
 * 
 * @returns array of all badges
 */
async function getAllBadges() {
    if (arguments.length != 0) throw `Incorrect number of arguments passed to 'getAllBadges'`;

    const badgeCollection = await badges();

    const badge = await badgeCollection.find().toArray();

    badge.forEach(element => {
        element._id = element._id.toString();
    })
    return badge;
}

/**
 * Deleted badge from the database
 * 
 * @param {ObjectId} id 
 * @returns "{ "badgeId": id, "deleted": true } if successful
 */
async function removeBadge(id) {
    if (arguments.length != 1) throw `Incorrect number of arguments passed to 'removeBadge'`;
    if (!id) throw `Id cannot be empty.`;
    if (typeof id != 'string') throw `Id must be a string.`;
    id = String.prototype.trim.call(id);
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId`;

    const badgeCollection = await badges();
    const deletionInfo = await badgeCollection.deleteOne({ _id: ObjectId(id) });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete badge with id of ${id}`;
    }
    return { "badgeId": id, "deleted": true };
}

/**
 * Updates badge in the databse
 * 
 * @param {ObjectId} id 
 * @param {String (BuildingCode)} building 
 * @param {Int} ptsNeeded 
 * @param {String} description 
 * @param {String} type
 * @returns updated badge
 */
async function updateBadge(id, building, ptsNeeded, description, type) {
    if (arguments.length != 5) throw `Incorrect number of arguments passed to 'updateBadge'`;

    if (!id) throw `Id cannot be empty.`;
    if (typeof id != 'string') throw `Id must be a string.`;
    id = String.prototype.trim.call(id);
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId`;

    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);

    if (ptsNeeded === null) throw `Points needed cannot be empty.`;
    if (typeof ptsNeeded != 'number') throw `Points needed must be a integer.`;

    if (!description) throw `Description cannot be empty.`;
    if (typeof description != 'string') throw `Description must be a string.`;
    description = String.prototype.trim.call(description);

    if (!type) throw `type cannot be empty.`;
    if (typeof type != 'string') throw `type must be a string.`;
    type = String.prototype.trim.call(type);

    const badgeCollection = await badges();

    const badge = await badgeCollection.findOne({ _id: ObjectId(id) });
    if (!badge) throw 'No badge with that id';

    let newbadge = {
        building: building,
        ptsNeeded: ptsNeeded,
        description: description,
        type: type
    };

    const insertInfo = await badgeCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: newbadge });
    if (insertInfo.matchedCount === 0) throw 'Could not update badge';

    const badge1 = await getBadge(id);
    return badge1;

}

/**
 * Gets all badges that a user is eligble for
 * 
 * @param {String} userName 
 * @returns array of badge objects
 */
async function getUsersBadges(userName) {
    if (arguments.length != 1) throw `Incorrect number of arguments passed to 'getUsersBadges'`;
    if (!userName) throw `Id cannot be empty.`;
    if (typeof userName != 'string') throw `Id must be a string.`;
    userName = String.prototype.trim.call(userName).toLowerCase();

    const allBadges = await getAllBadges();

    let usersBadges = [];

    for (let i = 0; i < allBadges.length; i++) {
        let val = await checkIfUserGetsBadge(userName, allBadges[i]._id.toString());
        if (val) {
            usersBadges.push(allBadges[i]);
        }
    }

    return usersBadges;
}

async function giveUserAllBadges(userName) {
    if (arguments.length != 1) throw `Incorrect number of arguments passed to 'getUsersBadges'`;
    if (!userName) throw `Id cannot be empty.`;
    if (typeof userName != 'string') throw `Id must be a string.`;
    userName = String.prototype.trim.call(userName).toLowerCase();

    const badgeArray = await getUsersBadges(userName);

    for (let i = 0; i < badgeArray.length; i++) {
        try {
            const val = await addAwardToUser(userName, badgeArray[i]._id.toString());
        }
        catch (e) {
            throw e
        }
    }
    return { 'message': "all badges added" }
}


/**
 * Adds badge to a user's awards
 * 
 * @param {String} username 
 * @param {ObjectId} awardID 
 * @returns the user with updated awards
 */
async function addAwardToUser(username, awardID) {
    if (arguments.length != 2) throw 'Error: Invalid number of arguments!'
    if (!username) throw 'Error: Username not supplied!'
    if (typeof username !== 'string') throw 'Error: Username must be a string!'
    if (username.trim().length === 0) throw 'Error: Username cannot be empty or only spaces!'
    const new_username = username.trim().toLowerCase();;

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: new_username });
    if (!foundUser) throw 'Error: User not found!'

    if (!awardID) throw 'Error: Award not supplied!'
    const newId = awardID.trim();

    if (!ObjectId.isValid(newId)) {
        throw 'Error: Award ID is not a valid ObjectID!'
    }

    const updatedInfo = await userCollection.updateOne({ username: new_username }, { $push: { awards: ObjectId(newId) } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could Not Update Awards Successfully';
    }

    return { 'message': 'success' };
}

/**
 * 
 * @param {String} userName
 * @param {ObjectId} badgeId 
 * @returns badgeId if user is eligble, undefined if ineligble.
 */
async function checkIfUserGetsBadge(userName, badgeId) {
    if (arguments.length != 2) throw `Incorrect number of arguments passed to 'checkIfUserGetsBadge'`;
    if (!userName) throw `Id cannot be empty.`;
    if (typeof userName != 'string') throw `Id must be a string.`;
    userName = String.prototype.trim.call(userName).toLowerCase();

    if (!badgeId) throw `Id cannot be empty.`;
    if (typeof badgeId != 'string') throw `Id must be a string.`;
    badgeId = String.prototype.trim.call(badgeId);
    if (!ObjectId.isValid(badgeId)) throw `BadgeId is not a valid ObjectId`;

    const userCollection = await users();
    const badgeCollection = await badges();
    const buildingCollection = await buildings();
    const foundUser = await userCollection.findOne({ username: userName });
    const foundBadge = await badgeCollection.findOne({ _id: ObjectId(badgeId) });

    if (!foundUser) throw 'Error: User not found!';
    if (!foundBadge) throw 'Error: Badge not found!';

    for (let i = 0; i < foundUser.buildings.length; i++) {
        let building = await buildingCollection.findOne({ _id: ObjectId(foundUser.buildings[i]) });
        if (!building) throw 'Error: Building not found!';
        if (building.buildingCode === foundBadge.building && building.xp >= foundBadge.ptsNeeded) {
            return true;
        }
    }
    return false;
}

/**
 * Creates all the badges for a specfic building.
 * 
 * @param {String (BuildingCode)} building
 * @param {Int[3]} levels (ptsNeeded for bronze, silver, and gold levels)
 */
async function populateBadges(building, levels) {
    if (arguments.length != 2) throw `Incorrect number of arguments passed to 'createBadge'`;
    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);
    if (!levels) throw `Levels cannot be empty.`;
    if (!Array.isArray(levels)) throw `Levels must be an array.`;
    let arr = [];
    levels.forEach(element => {
        if (typeof element != 'number') throw `${element} is not a number`;
        arr.push(element);
    });
    if (arr.length == 0) throw `Levels is not a valid array.`;
    levels = arr;

    let values = ["ENTRY", "BRONZE", "SILVER", "GOLD"];
    levels.unshift(0);

    try {
        for (let i = 0; i < 4; i++) {
            let full_description;
            if (i == 0) {
                full_description = `${building} - ${values[i]} Level: You are just getting started! Finish those tasks to level up!`;
            }
            else {
                full_description = `${building} - ${values[i]} Level: You have reached ${levels[i]} points! Keep it up!`;
            }
            await createBadge(building, levels[i], full_description, values[i]);
        }
    }
    catch (e) {
        throw e;
    }
}

module.exports = { createBadge, getBadge, removeBadge, updateBadge, getUsersBadges, populateBadges, getAllBadges, checkIfUserGetsBadge, giveUserAllBadges }