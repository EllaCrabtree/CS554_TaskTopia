const mongoCollections = require("../config/mongoCollections");
const buildings = mongoCollections.buildings;
const { ObjectId } = require("mongodb");

//Subdocument Avatar for Buildings
async function createAvatar(buildingId,name, image, welcome, completion, overdue) {
    if (arguments.length !== 6) throw 'You must provide 6 arguments for your avatar (buildingId,name, image, welcome, completion, overdue)';
    if (!buildingId) throw 'You must provide a buildingId for your avatar';
    if (!name) throw 'You must provide a name for your avatar';
    if (!image) throw 'You must provide an image for your avatar';
    if (!welcome) throw 'You must provide a welcome for your avatar';
    if (!completion) throw 'You must provide a completion for your avatar';
    if (!overdue) throw 'You must provide an overdue for your avatar';

    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (typeof name !== 'string') throw 'name must be a string';
    name = name.trim();
    if (name.length === 0) throw 'name must not be empty';

    if (typeof image !== 'string') throw 'image must be a string';
    image = image.trim();
    if (image.length === 0) throw 'image must not be empty';

    if(!Array.isArray(welcome)) throw 'welcome must be an array';
    if(!Array.isArray(completion)) throw 'completion must be an array';
    if(!Array.isArray(overdue)) throw 'overdue must be an array';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const newAvatar = {
        _id: new ObjectId(),
        name: name,
        image: image,
        welcome: welcome,
        completion: completion,
        overdue: overdue
    };

    building.avatar.push(newAvatar);
    const insertInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $set: { avatar: building.avatar } });
    if (insertInfo.insertedCount === 0) throw 'Could not add avatar';
    const newId = insertInfo.insertedId;
    const avatar = await this.getAvatar(newId);
    return avatar;
    
}

async function getAvatar(buildingId, id) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const avatar = building.avatar.find(avatar => avatar._id.toString() === id);
    if (avatar === null) throw 'No avatar with that id';
    return avatar;

}


async function getAllAvatars(buildingId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    return building.avatar;
}

async function removeAvatar(buildingId,id) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const avatar = building.avatar.find(avatar => avatar._id.toString() === id);
    if (avatar === null) throw 'No avatar with that id';

    const removeInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $pull: { avatar: { _id: ObjectId(id) } } });
    if (removeInfo.deletedCount === 0) {
        throw `Could not delete avatar with id of ${id}`;
    }
    return true;
}

async function updateAvatar(id, updatedAvatar) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    if (!updatedAvatar) throw 'You must provide an updated avatar';
    if (typeof updatedAvatar !== 'object') throw 'updated avatar must be an object';

    const buildingCollection = await buildings();
    const avatar = await this.getAvatar(id);
    if (avatar === null) throw 'No avatar with that id';

    const updatedAvatarData = {};

    if (updatedAvatar.name) {
        if (typeof updatedAvatar.name !== 'string') throw 'name must be a string';
        updatedAvatar.name = updatedAvatar.name.trim();
        if (updatedAvatar.name.length === 0) throw 'name must not be empty';
        updatedAvatarData.name = updatedAvatar.name;
    }

    if (updatedAvatar.image) {
        if (typeof updatedAvatar.image !== 'string') throw 'image must be a string';
        updatedAvatar.image = updatedAvatar.image.trim();
        if (updatedAvatar.image.length === 0) throw 'image must not be empty';
        updatedAvatarData.image = updatedAvatar.image;
    }

    if (updatedAvatar.welcome) {
        if(!Array.isArray(updatedAvatar.welcome)) throw 'welcome must be an array';
        updatedAvatarData.welcome = updatedAvatar.welcome;
    }

    if (updatedAvatar.completion) {
        if(!Array.isArray(updatedAvatar.completion)) throw 'completion must be an array';
        updatedAvatarData.completion = updatedAvatar.completion;
    }

    if (updatedAvatar.overdue) {
        if(!Array.isArray(updatedAvatar.overdue)) throw 'overdue must be an array';
        updatedAvatarData.overdue = updatedAvatar.overdue;
    }

    let updateCommand = {
        $set: updatedAvatarData
    };
    const query = {
        _id: ObjectId(id)
    };
    await buildingCollection.updateOne
    (query, updateCommand);
    return await this.getAvatar(id);
}

module.exports = {
    createAvatar,
    getAvatar,
    getAllAvatars,
    removeAvatar,
    updateAvatar
}



