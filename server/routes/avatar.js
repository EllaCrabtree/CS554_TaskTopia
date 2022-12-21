const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const im = require('imagemagick');
const {convert} = require('imagemagick-convert');


const router = express.Router();
const data = require('../data');
const buildingData = data.buildings;
const badgeData = data.badges;
const avatarData = require('../data/avatar.js')
const { ObjectId } = require("mongodb");

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({storage: storage}).single('img')

router.get('/:avatarID', async (req, res) => {
    try {


        const avatarID = req.params.avatarID

        if (!avatarID) {
            res.status(400).json({error: "You must provide an avatar ID!"})
        }

        if (typeof avatarID !== 'string') {
            res.status(400).json({error: "Avatar ID must be of type string"})
        }
    
        if (avatarID.trim().length === 0) {
            res.status(400).json({error: "Avatar ID must be a nonempty string!"})
        }
    
        if (!ObjectId.isValid(avatarID.trim())) {
            res.status(400).json({error: "Avatar ID is not a valid Object ID"})
        }

        const getAvatar = await avatarData.getAvatar(avatarID.trim());

        res.json(getAvatar);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:avatarID', async (req, res) => {
    try {


        const avatarID = req.params.avatarID

        if (!avatarID) {
            res.status(400).json({error: "You must provide an avatar ID!"})
        }

        if (typeof avatarID !== 'string') {
            res.status(400).json({error: "Avatar ID must be of type string"})
        }
    
        if (avatarID.trim().length === 0) {
            res.status(400).json({error: "Avatar ID must be a nonempty string!"})
        }
    
        if (!ObjectId.isValid(avatarID)) {
            res.status(400).json({error: "Avatar ID is not a valid Object ID"})
        }

        const deleteConfirmation = await avatarData.removeAvatar(avatarID.trim());

        res.json(deleteConfirmation);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res) => {
    // console.log(req.headers)
    // console.log(req)
    const {name, img, welcomeList, niceList, meanList, buildingID} = req.body;
    console.log(req.body)
    
    if (!name) {
        res.status(400).json({error: "You must provide an avatar name!"})
    }

    if (typeof name !== 'string') {
        res.status(400).json({error: "Avatar name must be a string!"})
    }

    if (name.trim().length === 0) {
        res.status(400).json({error: "Avatar name cannot be the empty string or just spaces!"})
    }

    if (!img) {
        res.status(400).json({error: "You must provide an avatar image!"})
    }

    if (typeof img !== 'string') {
        res.status(400).json({error: "Avatar image must be a string!"})
    }

    if (img.trim().length === 0) {
        res.status(400).json({error: "Avatar image cannot be the empty string or just spaces!"})
    }

    // if (Buffer.from(img, 'base64').toString('base64') !== img) {
    //     res.status(400).json({error: "Avatar image must be a valid base64 encoded string!"})
    // }

    if (!welcomeList) {
        res.status(400).json({error: "You must provide a list of welcome strings"})
    }

    if (!Array.isArray(welcomeList)) {
        res.status(400).json({error: "WelcomeList must be an array"})
    }

    if (welcomeList.length === 0) {
        res.status(400).json({error: "Welcome List Array must have at least one string"})
    }

    let newWelcomeList = []

    welcomeList.forEach((elem) => {
        if (typeof elem !== 'string' || elem.trim().length === 0) {
            res.status(400).json({error: "All elements within welcome list must be nonempty strings!"})
        }
        newWelcomeList.push(elem.trim());
    })

    if (!niceList) {
        res.status(400).json({error: "You must provide a list of congratulatory strings"})
    }

    if (!Array.isArray(niceList)) {
        res.status(400).json({error: "NiceList must be an array"})
    }

    if (niceList.length === 0) {
        res.status(400).json({error: "Nice List Array must have at least one string"})
    }

    let newNiceList = []

    niceList.forEach((elem) => {
        if (typeof elem !== 'string' || elem.trim().length === 0) {
            res.status(400).json({error: "All elements within nice list must be nonempty strings!"})
        }
        newNiceList.push(elem.trim());
    })

    if (!meanList) {
        res.status(400).json({error: "You must provide a list of mean strings"})
    }

    if (!Array.isArray(meanList)) {
        res.status(400).json({error: "MeanList must be an array"})
    }

    if (meanList.length === 0) {
        res.status(400).json({error: "Mean List Array must have at least one string"})
    }

    let newMeanList = []

    meanList.forEach((elem) => {
        if (typeof elem !== 'string' || elem.trim().length === 0) {
            res.status(400).json({error: "All elements within mean list must be nonempty strings!"})
        }
        newMeanList.push(elem.trim());
    })

    if (!buildingID) {
        res.status(400).json({error: "You must provide the building ID the avatar is made for!"})
    }

    if (typeof buildingID !== 'string') {
        res.status(400).json({error: "Building ID must be of type string"})
    }

    if (buildingID.trim().length === 0) {
        res.status(400).json({error: "Building ID must be a nonempty string!"})
    }

    if (!ObjectId.isValid(buildingID.trim())) {
        res.status(400).json({error: "Building ID is not a valid Object ID"})
    }

    let buffer = Buffer.from(img.split(',')[1], "base64");

    const imgBuffer = await convert({
        srcData: buffer,
        // srcFormat: 'JPEG',
        quality: 100,
        width: 250,
        height: 250,
        resize: 'crop',
        format: 'JPEG',
        // quality: 75
    })

    try {

        const createdAvatar = await avatarData.createAvatar(name.trim(), imgBuffer.toString('base64'), newWelcomeList, newNiceList, newMeanList);
        await buildingData.addAvatarToBuilding(buildingID.trim(), createdAvatar._id);
        // console.log('we did it')
        // res.json({data: 'ok'});
        res.json(createdAvatar);
    } catch (e) {
        console.log(e);
    }
    console.log('resized');

    

});

module.exports = router;