const express = require("express");

const router = express.Router();
const data = require("../data");
const userData = data.users;
const badgeData = data.badges;
const { ObjectId } = require("mongodb");

router.get("/", (req, res) => {
  //Home Page
  //links to login, signup, has description of website
});

router.get("/login", (req, res) => {});

router.post("/login", async (req, res) => {});

router.get("/signup", (req, res) => {});

router.post("/signup", async (req, res) => {
  const userInfo = req.body;

  if (!userInfo) {
    res.status(400).json({
      error: "You must provide user information to create a new user",
    });
    return;
  }

  if (!userInfo.firstName) {
    res
      .status(400)
      .json({ error: "You must provide a first name to create a user" });
    return;
  }

  if (!userInfo.lastName) {
    res
      .status(400)
      .json({ error: "You must provide a last name to create a user" });
    return;
  }

  if (!userInfo.username) {
    res
      .status(400)
      .json({ error: "You must provide a username to create a user" });
    return;
  }

  if (!userInfo.password) {
    res
      .status(400)
      .json({ error: "You must provide a password to create a user" });
    return;
  }

  if (!userInfo.email) {
    res
      .status(400)
      .json({ error: "You must provide an email to create a user" });
    return;
  }

  if (!userInfo.uid) {
    res.status(400).json({ error: "You must provide a uid to create a user" });
    return;
  }

  try {
    const newUser = await userData.createUser(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.username,
      userInfo.password,
      userInfo.email,
      userInfo.uid
    );
    res.status(200).json(newUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
