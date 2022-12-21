const express = require('express');

const router = express.Router();
const data = require('../data');
const userData = data.users;
const buildingData = data.buildings;

router.get('/buildings/:email', async (req, res) => {

    const email = req.params.email

    try {
        const val = await buildingData.getUserBuildings(email);
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

router.get('/uid/:uid', async (req, res) => {
    if (!req.params.uid) return res.status(400).json({ error: 'You must provide a uid.' });

    try {
        const val = await userData.getUserByUID(req.params.uid);
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

module.exports = router;