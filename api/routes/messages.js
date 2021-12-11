const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require('../models/Conversation')
const mongoose = require('mongoose')
//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  const {conversationId, ...lastText}= req.body;
  console.log();
  try {
    const savedMessage = await newMessage.save();
    const result = await Conversation.findByIdAndUpdate({_id: conversationId}, {lastText});
    res.status(200).json({content: savedMessage, status: 1});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json({content: messages, status: 1});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/delete", async(req, res) => {

  try {
    const mes = await Message.deleteMany();
  } catch(err) {

  }

})

router.post("/update-last-message", async (req, res, next) => {
  const { messId, userId } = req.body;
  try {

    const updatemess = await Message.update(
      {_id: messId, 'seens.id': userId},
        {$set:  {seen: true,"seens.$.seen": true} }) 
       res.status(200).json({content: "Update messenger success!", status: 1});

  } catch(err) {
      res.status(500).json({content: "Update failds!", status: 0})
  }
 
})

// Go tin nhawn 
router.post('/gotinnhan', async (req, res, next) => {
  const {messId} = req.body;
  const result = await Message.findByIdAndUpdate({_id: messId}, {go: true});
  result && res.status(200).json({content: result, status: 1});
})

module.exports = router;
