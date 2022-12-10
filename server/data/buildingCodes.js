/**
 * Mock ENUM values
 * 
 * to use:
 *      const buildingCodes = require("./data/buildingCodes")
 *      buildingCodes.ADMIN => returns string "ADMIN"
 */
async function isValidBuildingCode(buildingCode) {
    return Object.values(BuildingCodes).includes(buildingCode);
}

BuildingCodes = {
    ADMIN: "ADMIN",
    EDUCATION: "EDUCATION",
    HOME: "HOME",
    GARDEN: "GARDEN",
    STORE: "STORE",
    PARK: "PARK"
}

module.exports = {BuildingCodes, isValidBuildingCode};