const express = require('express');

const router = express.Router();
const data = require('../data');
const buildingData = data.buildings;
const { ObjectId } = require("mongodb");

router.get('/', async (req, res) => {
    try {
        const buildings = await buildingData.getAllBuildings();
        res.json(buildings);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const building = await buildingData.getBuilding(req.params.id);
        res.json(building);
    } catch (e) {
        res.status(404).json({ error: 'Building not found' });
    }
});

router.post('/', async (req, res) => {
    const building = req.body;

    if (!building) {
        res.status(400).json({ error: 'You must provide data to create a building' });
        return;
    }

    if (!building.buildingCode) {
        res.status(400).json({ error: 'You must provide a code for the building' });
        return;
    }

    if (!building.xp) {
        res.status(400).json({ error: 'You must provide an xp' });
        return;
    }

    if (!building.xpMax) {
        res.status(400).json({ error: 'You must provide an xp max to the building' });
        return;
    }

    if (!building.level) {
        res.status(400).json({ error: 'You must provide a level for the building' });
        return;
    }

    try {
        const newBuilding = await buildingData.createBuilding(building.buildingCode, building.xp, building.xpMax, building.level);
        res.json(newBuilding);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.put('/:id', async (req, res) => {
    //check arguments
    const building = req.body;

    if (!building) {
        res.status(400).json({ error: 'You must provide data to create a building' });
        return;
    }

    if (!building.buildingCode) {
        res.status(400).json({ error: 'You must provide a code for the building' });
        return;
    }

    if (!building.xp) {
        res.status(400).json({ error: 'You must provide an xp' });
        return;
    }

    if (!building.xpMax) {
        res.status(400).json({ error: 'You must provide an xp max to the building' });
        return;
    }

    if (!building.level) {
        res.status(400).json({ error: 'You must provide a level for the building' });
        return;
    }

    if (!building.Avatar) {
        res.status(400).json({ error: 'You must provide Avatars for the building' });
        return;
    }

    if (!building.Tasks) {
        res.status(400).json({ error: 'You must provide Tasks for the building' });
        return;
    }

    try {
        const updatedBuilding = await buildingData.updateBuilding(req.params.id, building.buildingCode,building.xp,building.xpMax,building.level,building.Avatar,building.Tasks);
        res.json(updatedBuilding);
    } catch {
        res.status(404).json({ error: "Building not found" });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) return res.status(400).json({ error: 'You must provide an id for the building to delete it.' });
    try {
        await buildingData.removeBuilding(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.status(404).json({ error: 'Building not found' });
    }
});

module.exports = router;