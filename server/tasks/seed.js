const data = require("../data");
const badgeData = data.badges;
const usersData = data.users;
const buildingsData = data.buildings;
const taskData = data.tasks;
const { ObjectId } = require("mongodb");

const connection = require("../config/mongoConnection");

const buildingCodes = require("../data/buildingCodes");


async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    try {
        //create users
        const user1 = await usersData.createUser('Odin', 'Crabtree', 'Odline', 'the_baby_lulu123$', 'urmom@gmail.com')
        const user2 = await usersData.createUser("Bella", "Cruz", "BellaTheBaddie", "TopSecret123$", "Baddie@gmail.com")

        //Create buildings
        const bu1 = await buildingsData.createBuilding(buildingCodes.BuildingCodes.EDUCATION, 20, 100, 2);
        const bu2 = await buildingsData.createBuilding(buildingCodes.BuildingCodes.ADMIN, 2, 30, 1);
        const bu3 = await buildingsData.createBuilding(buildingCodes.BuildingCodes.PARK, 8, 10, 3);

        await usersData.addBuildingToUser('Odline', bu1._id);
        await usersData.addBuildingToUser('Odline', bu2._id);
        await usersData.addBuildingToUser('BellaTheBaddie', bu3._id);

        // Populate all possible badges
        const b1 = await badgeData.populateBadges(buildingCodes.BuildingCodes.ADMIN, [20, 25, 35]);
        const b2 = await badgeData.populateBadges(buildingCodes.BuildingCodes.EDUCATION, [10, 20, 30]);
        const b3 = await badgeData.populateBadges(buildingCodes.BuildingCodes.STORE, [5, 15, 30]);
        const b4 = await badgeData.populateBadges(buildingCodes.BuildingCodes.PARK, [10, 20, 30]);
        const b5 = await badgeData.populateBadges(buildingCodes.BuildingCodes.GARDEN, [5, 10, 20]);
        const b6 = await badgeData.populateBadges(buildingCodes.BuildingCodes.HOME, [5, 15, 30]);

        // Create Task
        const t1 = await taskData.createTask(bu1._id, "Finish 554 Project", "2022-12-20", ["Check Tota11y validation", "Check HTML validation"]);
        const t2 = await taskData.createTask(bu1._id, "Take final", "2022-12-16", ["study for it :("]);
        const t3 = await taskData.createTask(bu2._id, "Sign Lease", "2022-12-28", ["check and pay fees"]);
        const t4 = await taskData.createTask(bu3._id, "Workout", "2022-12-31", ["run 1 mile", "actually run 3 miles"]);
    }
    catch (error) {
        console.log(error);
    }

    await connection.closeConnection();
}

main();