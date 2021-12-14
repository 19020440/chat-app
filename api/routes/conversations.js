const router = require("express").Router();
const Conversation = require("../models/Conversation");
const ConversationController = require('../controllers/ConversationController')
//new conv

router.post("/", ConversationController.newCov);

//get conv of a user

router.get("/:userId", ConversationController.getCovOfUser);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", ConversationController.findCovByTwoId);
//update
router.post('/update', ConversationController.update)
//
router.post('/update/property', ConversationController.update_cov)
//leaverGroup
router.post('/leave-group', ConversationController.leave_group)
//uddate image

router.post('/update-image', async (req, res, next) => {
    const {covId, userId, src} = req.body;
    try {
        const [memberU, lastTextU] = await Promise.all([Conversation.update(
            {$and: [{_id: covId}, {'lastText.seens.id': userId}]},
            {$set:  {'lastText.seens.$.profilePicture': src },}), 
            Conversation.update(
                {$and: [{_id: covId}, {'members.id': userId}]},         
                  {$set:  {'members.$.profilePicture': src },}) 
                ])
        memberU && lastTextU && res.status(200).json({content: {memberU, lastTextU}, status: 1})
        // const result = await Conversation.update(
        //     {$and: [{_id: covId}, {'members.id': userId}]},         
        //       {$set:  {'members.$.profilePicture': src }})
        //     result && res.json({content: result, status: 1})

    } catch(err) {
        res.status(500).json({content: err, status: 0});
    }
    
})

router.post('/add-member', async (req, res, next) => {
    const {covId, user} = req.body;
    try{
        const currentCov = await Conversation.findById(covId).exec();
        const addMember = await currentCov.updateOne({$push: {members: user, 'lastText.seens': {...user, seen: false}}});
        addMember && res.status(200).json({content: addMember, status: 1});
    } catch(err) {
        res.status(500).json({content: err, status: 0})
    }
    

})
module.exports = router;
