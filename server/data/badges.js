async function createBadge(building, ptsNeeded, description) {
    if (arguments.length != 3) throw `Incorrect number of arguments passed to 'createBadge'`;
    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);
    if (!ObjectId.isValid(building)) throw `building is not a valid ObjectId`;

    if (!ptsNeeded) throw `Points needed cannot be empty.`;
    if (typeof ptsNeeded != 'number') throw `Points needed must be a integer.`;

    if (!description) throw `Description cannot be empty.`;
    if (typeof description != 'string') throw `Description must be a string.`;
    description = String.prototype.trim.call(description);

    const badgeCollection = await badges();

    let newbadge = {
        building: building,
        ptsNeeded: ptsNeeded,
        description: description
    }

    const insertInfo = await badgeCollection.insertOne(newbadge);
    if (insertInfo.insertedCount === 0) throw 'Could not add badge';

    const newId = insertInfo.insertedId.toString();

    const badge = await getBadge(newId);
    return badge;
}

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

async function getAllBadges() {
    if (arguments.length != 0) throw `Incorrect number of arguments passed to 'getAllBadges'`;

    const badgeCollection = await badges();

    const badge = await badgeCollection.find().toArray();

    badge.forEach(element => {
        element._id = element._id.toString();
    })
    return badge;
}

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

async function updateBadge(id, building, ptsNeeded, description) {
    if (arguments.length != 4) throw `Incorrect number of arguments passed to 'updateBadge'`;

    if (!id) throw `Id cannot be empty.`;
    if (typeof id != 'string') throw `Id must be a string.`;
    id = String.prototype.trim.call(id);
    if (!ObjectId.isValid(id)) throw `id is not a valid ObjectId`;

    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);
    if (!ObjectId.isValid(building)) throw `id is not a valid ObjectId`;

    if (!ptsNeeded) throw `Points needed cannot be empty.`;
    if (typeof ptsNeeded != 'number') throw `Points needed must be a integer.`;

    if (!description) throw `Description cannot be empty.`;
    if (typeof description != 'string') throw `Description must be a string.`;
    description = String.prototype.trim.call(description);


    const badgeCollection = await badges();

    const badge = await badgeCollection.findOne({ _id: ObjectId(id) });
    if (!badge) throw 'No badge with that id';

    let newbadge = {
        building: building,
        ptsNeeded: ptsNeeded,
        description: description
    };

    const insertInfo = await bandCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: newbadge });
    if (insertInfo.matchedCount === 0) throw 'Could not update badge';

    const badge1 = await getBadge(id);
    return badge1;

}

async function getUsersBadges(userId) {
    if (arguments.length != 1) throw `Incorrect number of arguments passed to 'getUsersBadges'`;
    if (!userId) throw `Id cannot be empty.`;
    if (typeof userId != 'string') throw `Id must be a string.`;
    userId = String.prototype.trim.call(userId);
    if (!ObjectId.isValid(userId)) throw `id is not a valid ObjectId`;

    //TODO
}

/**
 * Creates all the badges for a specfic building.
 * 
 * @param building - ObjectId
 * @param levels - Int[3] (ptsNeeded for bronze, silver, and gold levels)
 */
async function populateBadges(building, levels) {
    if (arguments.length != 2) throw `Incorrect number of arguments passed to 'createBadge'`;
    if (!building) throw `Building cannot be empty.`;
    if (typeof building != 'string') throw `Building must be a string.`;
    building = String.prototype.trim.call(building);
    if (!ObjectId.isValid(building)) throw `building is not a valid ObjectId`;

    if (!levels) throw `Levels cannot be empty.`;
    if (!Array.isArray(levels)) throw `Levels must be an array.`;
    let arr = [];
    levels.forEach(element => {
        if (typeof element != 'number') throw `${element} is not a number`;
        arr.push(element);
    });
    if (arr.length == 0) throw `Levels is not a valid array.`;
    levels = arr;

    let values = ["Entry", "Bronze", "Silver", "Gold"];

    for (let i = 0; i < 4; i++) {
        let full_description;
        if (i == 0) {
            full_description = `Entry Level: You are just getting started! Finish those tasks to level up!`;
        }
        else {
            full_description = `${values[i]} Level: You have reached ${levels[i - 1]} points! Keep it up!`;
        }
        createBadge(building, levels[i - 1], full_description);
    }
}

module.exports = { createBadge, getBadge, removeBadge, updateBadge, getUsersBadges, populateBadges, getAllBadges }