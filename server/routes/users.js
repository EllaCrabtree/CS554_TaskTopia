const express = require('express');

const router = express.Router();
const data = require('../data');
const userData = data.users;
const buildingData = data.buildings;

router.get('/buildings', async (req, res) => {
    try {
        const val = await buildingData.getUserBuildings("odline");
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

router.get('/:username', async (req, res) => {
    if (!req.params.username) return res.status(400).json({ error: 'You must provide a username.' });

    try {
        const val = await userData.getUserByUsername(req.params.username);
        return res.status(200).json(val);
    }
    catch (e) {
        return res.status(404).json({ error: e })
    }
})

module.exports = router;