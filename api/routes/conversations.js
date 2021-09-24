const router = require("express").Router();
const Conversation = require("../models/Conversation");
const ConversationController = require('../controllers/ConversationController')
//new conv

router.post("/", ConversationController.newCov);

//get conv of a user

router.get("/:userId", ConversationController.getCovOfUser);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", ConversationController.findCovByTwoId);

module.exports = router;
