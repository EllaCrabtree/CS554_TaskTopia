const data = require("../data");
const badgeData = data.badges;
const { ObjectId } = require("mongodb");

const connection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const badges = mongoCollections.badges;

const buildingCodes = require("../data/buildingCodes")


async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    try {
        const b1 = await badgeData.createBadge(buildingCodes.ADMIN, 50, "this is the description");
        const b3 = await badgeData.populateBadges(buildingCodes.EDUCATION, [10, 20, 30]);
    }
    catch (error) {
        console.log(error);
    }

    await connection.closeConnection();
}

main();