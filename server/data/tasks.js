const mongoCollections = require("../config/mongoCollections");
const buildings = mongoCollections.buildings;
const { ObjectId } = require("mongodb");
const moment = require('moment');

async function createTask(buildingId, name, dateDue) {
    if (arguments.length !== 3) throw 'You must provide 4 arguments for your task (buildingId,name,datePosted,dateDue)';
    if (!buildingId) throw 'You must provide a buildingId for your task';
    if (!name) throw 'You must provide a name for your task';
    if (!dateDue) throw 'You must provide a dateDue for your task';

    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (typeof name !== 'string') throw 'name must be a string';
    name = name.trim();
    if (name.length === 0) throw 'name must not be empty';

    if (typeof dateDue !== 'string') throw 'dateDue must be a string';
    dateDue = dateDue.trim();
    if (dateDue.length === 0) throw 'dateDue must not be empty';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    let datePosted = moment().format('YYYY-MM-DD').toString()
    let dueDateMoment = moment(dateDue).format('YYYY-MM-DD').toString();

    const newTask = {
        _id: new ObjectId(),
        name: name,
        datePosted: datePosted,
        dateDue: dueDateMoment,
        notes: [],
        isOverdue: false,
        isCompleted: false
    };

    const insertInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $push: { Tasks: newTask } });
    if (insertInfo.modifiedCount === 0) throw 'Could not add task';

    return await getTask(buildingId, newTask._id.toString());
}

async function getTask(buildingId, taskId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    return await checkIfTaskOverdue(buildingId, taskId);
}

async function getAllTasks(buildingId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    return building.Tasks;
}

async function updateTask(buildingId, taskId, updatedTask) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    if (!updatedTask) throw 'You must provide an updatedTask to search for';
    if (typeof updatedTask !== 'object') throw 'updatedTask must be an object';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.Tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    const updatedTaskData = {};

    if (updatedTask.name) {
        if (typeof updatedTask.name !== 'string') throw 'name must be a string';
        updatedTask.name = updatedTask.name.trim();
        if (updatedTask.name.length === 0) throw 'name must not be empty';

        updatedTaskData.name = updatedTask.name;
    }

    if (updatedTask.datePosted) {
        if (typeof updatedTask.datePosted !== 'string') throw 'datePosted must be a string';
        updatedTask.datePosted = updatedTask.datePosted.trim();
        if (updatedTask.datePosted.length === 0) throw 'datePosted must not be empty';

        updatedTaskData.datePosted = moment(updatedTask.datePosted).format('YYYY-MM-DD').toString();
    }

    if (updatedTask.dateDue) {
        if (typeof updatedTask.dateDue !== 'string') throw 'dateDue must be a string';
        updatedTask.dateDue = updatedTask.dateDue.trim();
        if (updatedTask.dateDue.length === 0) throw 'dateDue must not be empty';

        updatedTaskData.dateDue = moment(updatedTask.dateDue).format('YYYY-MM-DD').toString();
    }

    if (updatedTask.notes) {
        if (!Array.isArray(updatedTask.notes)) throw 'notes must be an array';

        updatedTaskData.notes = updatedTask.notes;
    }

    if (updatedTask.isOverdue != undefined) {
        if (typeof updatedTask.isOverdue !== 'boolean') throw 'isOverdue must be a boolean';

        updatedTaskData.isOverdue = updatedTask.isOverdue;
    }

    if (updatedTask.isCompleted != undefined) {
        if (typeof updatedTask.isCompleted !== 'boolean') throw 'isCompleted must be a boolean';

        updatedTaskData.isCompleted = updatedTask.isCompleted;
    }

    const updateQuery = {
        'Tasks.$.name': updatedTaskData.name,
        'Tasks.$.datePosted': updatedTaskData.datePosted,
        'Tasks.$.dateDue': updatedTaskData.dateDue,
        'Tasks.$.notes': updatedTaskData.notes,
        'Tasks.$.isOverdue': updatedTaskData.isOverdue,
        'Tasks.$.isCompleted': updatedTaskData.isCompleted
    }

    await buildingCollection.updateOne({ '_id': ObjectId(buildingId), 'Tasks._id': ObjectId(taskId) }, { $set: updateQuery });
    return await getTask(buildingId, taskId);
}

async function removeTask(buildingId, taskId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.Tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    const deletionInfo = await buildingCollection.updateOne({ _id: ObjectId(buildingId) }, { $pull: { Tasks: { _id: ObjectId(taskId) } } });
    if (deletionInfo.deletedCount === 0) throw `Could not delete task with id of ${taskId}`;

    return true;
}

async function checkIfTaskOverdue(buildingId, taskId) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.Tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    const currDate = moment().format("YYYY-MM-DD");
    const dueDate = moment(task.dateDue).format("YYYY-MM-DD");

    if (currDate > dueDate && task.isOverdue == false) {
        task.isOverdue = true;
        const updatedTask = await updateTask(buildingId, taskId, task);
        updatedTask._id = updatedTask._id.toString();
        return updatedTask;
    }
    else {
        task._id = task._id.toString();
        return task;
    }
}

async function addNotestoTask(buildingId, taskId, note) {
    if (!buildingId) throw 'You must provide a buildingId to search for';
    if (typeof buildingId !== 'string') throw 'buildingId must be a string';
    buildingId = buildingId.trim();
    if (buildingId.length === 0) throw 'buildingId must not be empty';
    // if (!ObjectId.isValid(buildingId)) throw 'buildingId must be a valid ObjectId';

    if (!taskId) throw 'You must provide a taskId to search for';
    if (typeof taskId !== 'string') throw 'taskId must be a string';
    taskId = taskId.trim();
    if (taskId.length === 0) throw 'taskId must not be empty';
    if (!ObjectId.isValid(taskId)) throw 'taskId must be a valid ObjectId';

    if (!note) throw 'Notes must be provided';
    if (typeof note !== 'string') throw 'note must be a string';
    note = note.trim();
    if (note.length === 0) throw 'note must not be empty';

    const buildingCollection = await buildings();
    const building = await buildingCollection.findOne({ _id: ObjectId(buildingId) });
    if (building === null) throw 'No building with that id';

    const task = building.Tasks.find((task) => task._id.toString() === taskId);
    if (task === null) throw 'No task with that id';

    task.notes.push(note);
    return await updateTask(buildingId, taskId, task);
}

module.exports = {
    createTask,
    getTask,
    getAllTasks,
    updateTask,
    removeTask,
    checkIfTaskOverdue,
    addNotestoTask
};



