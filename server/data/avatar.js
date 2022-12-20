const mongoCollections = require("../config/mongoCollections");
const buildings = mongoCollections.buildings;
const avatars = mongoCollections.avatars;
const { ObjectId, Binary } = require("mongodb");
const im = require('imagemagick');
// const gm = require('gm')
const path = require('path')
const fs = require('fs');

//Avatar
async function createAvatar(name, image, welcome, completion, overdue) {
    if (arguments.length !== 5) throw 'You must provide 5 arguments for your avatar (name, image, welcome, completion, overdue)';
    // if (!buildingId) throw 'You must provide a buildingId for your avatar';
    if (!name) throw 'You must provide a name for your avatar';
    if (!image) throw 'You must provide an image for your avatar';
    if (!welcome) throw 'You must provide a welcome for your avatar';
    if (!completion) throw 'You must provide a completion for your avatar';
    if (!overdue) throw 'You must provide an overdue for your avatar';

    // if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    // buildingId = buildingId.trim();
    // if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (typeof name !== 'string') throw 'name must be a string';
    name = name.trim();
    if (name.length === 0) throw 'name must not be empty';

    if (typeof image !== 'string') throw 'image must be a string';
    // image = image.trim();
    if (image.length === 0) throw 'image must not be empty';

    if (!Array.isArray(welcome)) throw 'welcome must be an array';
    if (!Array.isArray(completion)) throw 'completion must be an array';
    if (!Array.isArray(overdue)) throw 'overdue must be an array';

    const avatarCollection = await avatars();
    // const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    // if (building === null) throw 'No building with that id';

    // let avatarId = new ObjectId();
    // const pathToImage = await cropAvatar(avatarId, image);
    // console.log(pathToImage);

    let buffer = Buffer.from(image.split(',')[1], "base64");
    let fileExt = image.substring(image.indexOf('/')+1, image.indexOf(';'));

    fs.writeFileSync(path.join(__dirname, `../files/test1.${fileExt}`), buffer);
    console.log(fileExt);

    let compressedImagePath;
    const res = im.resize({
        srcPath: path.join(__dirname, `../files/test1.${fileExt}`),
        dstPath: path.join(__dirname, `../files/test2.jpg`),
        format: 'JPG',
        quality: 50,
        width: 250
    });
    console.log('resized');

    compressedImagePath = fs.readFileSync(path.join(__dirname, `../files/test2.jpg`), {encoding: 'base64'});
        compressedImagePath = `data:image/jpeg;base64,${compressedImagePath}`;

        const newAvatar = {
            name: name,
            image: compressedImagePath,
            welcome: welcome,
            completion: completion,
            overdue: overdue
        };

        const insertInfo = await avatarCollection.insertOne(newAvatar)
        if (insertInfo.insertedCount === 0) throw 'Could not add avatar';

        console.log(insertInfo.insertedId);
        return getAvatar(insertInfo.insertedId.toString());

    // console.log(res);
    

    //Uncomment this later

    // building.avatar.push(newAvatar);
    // const insertInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $set: { avatar: building.avatar } });
    // if (insertInfo.insertedCount === 0) throw 'Could not add avatar';
    // const newId = insertInfo.insertedId;
    // const avatar = await this.getAvatar(newId);

    

}

async function getAvatar(id) {
    // if (!buildingId) throw 'You must provide a buildingId to search for';
    // if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    // buildingId = buildingId.trim();
    // if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'id must be a string';
    id = id.trim();
    if (id.length === 0) throw 'id must not be empty';
    if (!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';

    const avatarCollection = await avatars();
    const avatar = await avatarCollection.findOne({ _id: ObjectId(id) });
    if (avatar === null) throw 'No building with that id';

    avatar._id = avatar._id.toString();

    // const avatar = building.avatar.find(avatar => avatar._id.toString() === id);
    // if (avatar === null) throw 'No avatar with that id';
    // return avatar;

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

async function removeAvatar(buildingId, id) {
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
        if (!Array.isArray(updatedAvatar.welcome)) throw 'welcome must be an array';
        updatedAvatarData.welcome = updatedAvatar.welcome;
    }

    if (updatedAvatar.completion) {
        if (!Array.isArray(updatedAvatar.completion)) throw 'completion must be an array';
        updatedAvatarData.completion = updatedAvatar.completion;
    }

    if (updatedAvatar.overdue) {
        if (!Array.isArray(updatedAvatar.overdue)) throw 'overdue must be an array';
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

async function cropAvatar(avatarId, url) {
    // if (typeof avatarId !== 'string') throw 'avatarId must be a string';
    // avatarId = avatarId.trim();
    // if (avatarId.length === 0) throw 'avatarId must not be empty';
    // if (!ObjectId.isValid(avatarId)) throw 'avatarId must be a valid ObjectId';

    if (typeof url !== 'string') throw 'image must be a string';
    url = url.trim();
    if (url.length === 0) throw 'image must not be empty';


    // console.log(path.join(__dirname, `../files/kikimonster.jpg`));

    // const res = im.crop({
    //     srcPath: path.join(__dirname, `../files/kikimonster.jpg`),
    //     dstPath: path.join(__dirname, `../files/kikimonsterupgrade2.webp`),
    //     width: 400,
    //     quality: 1,
    //     gravity: "Center"
    // });

    let buffer = Buffer.from(url.split(',')[1], "base64");
    fs.writeFileSync(path.join(__dirname, `../files/test1.jpg`), buffer);


    // const res = im.convert([path.join(__dirname, `../files/kikimonster.jpg`), '-resize', '400x400', path.join(__dirname, `../files/kikimonsterupgrade2.webp`)])

    let compressedImagePath;

    im.resize({
        srcPath: path.join(__dirname, `../files/test1.jpg`),
        dstPath: path.join(__dirname, `../files/test2.jpg`),
        quality: 50,
        width: 250
    }, function(err, stdout, stderr) {
        if (err) throw err;
        console.log('resized');

        compressedImagePath = fs.readFileSync(path.join(__dirname, `../files/test2.jpg`), {encoding: 'base64'});
        // return `data:image/jpeg;base64,${compressedImagePath}`;
    });

    // console.log('base64 new encoding')
    // console.log(compressedImagePath)

    return `data:image/jpeg;base64,${compressedImagePath}`;


    // gm(Buffer.from(url, "base64")).resize(240, 240).write('imageOutput.png', (err) => {
    //     console.log(err);
    // })

    // return `../avatarImgs/${avatarId}.png`;
}

module.exports = {
    createAvatar,
    getAvatar,
    getAllAvatars,
    removeAvatar,
    updateAvatar,
    cropAvatar
}



