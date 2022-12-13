const express = require('express');

const router = express.Router();
const data = require('../data');
const taskData = data.tasks;

router
    .get('/:buildingId/:taskId', async (req, res) => {
        if (!req.params.buildingId) return res.status(400).json({ error: 'You must provide an id for the task\'s building.' });
        if (!req.params.taskId) return res.status(400).json({ error: 'You must provide an id for the task.' });

        try {
            const val = await taskData.getTask(req.params.buildingId, req.params.taskId);
            return res.json(val);
        }
        catch (e) {
            return res.status(404).json({ error: e })
        }
    });

module.exports = router;