const data = require("../data");
const badgeData = data.badges;
const usersData = data.users;
const { ObjectId } = require("mongodb");

const connection = require("../config/mongoConnection");

const buildingCodes = require("../data/buildingCodes")


async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    try {
        //create users
        const user1 = await usersData.createUser('Odin', 'Crabtree', 'Odline', 'the_baby_lulu', 'urmom@gmail.com')
        const user2 = await usersData.createUser("Bella", "Cruz", "BellaTheBaddie", "TopSecret123", "Baddie@gmail.com")

        // Populate all possible badges
        const b1 = await badgeData.populateBadges(buildingCodes.ADMIN, [20, 25, 35]);
        const b2 = await badgeData.populateBadges(buildingCodes.EDUCATION, [10, 20, 30]);
        const b3 = await badgeData.populateBadges(buildingCodes.STORE, [5, 15, 30]);
        const b4 = await badgeData.populateBadges(buildingCodes.PARK, [10, 20, 30]);
        const b5 = await badgeData.populateBadges(buildingCodes.GARDEN, [5, 10, 20]);
        const b6 = await badgeData.populateBadges(buildingCodes.HOME, [5, 15, 30]);
    }
    catch (error) {
        console.log(error);
    }

    await connection.closeConnection();
}

main();