const User = require("../models/User");
const Conversation = require('../models/Conversation');

module.exports  = new class ConversationController {
    //new Cov
    async newCov(req, res, next) {

            // const sender = await User.findById(req.body.senderId).exec();
            // const receive = await User.findById(req.body.receiverId).exec();
            Promise.all([User.findById(req.body.senderId).exec(),User.findById(req.body.receiverId).exec()])
              .then(async ([sender1, receive1]) => {
                if(sender1 && receive1) {
                  const member1 = {
                    id: req.body.senderId,
                    profilePicture: sender1.profilePicture,
                    username: sender1.username,
                  }
  
                  const member2 = {
                    id: req.body.receiverId,
                    profilePicture: receive1.profilePicture,
                    username: receive1.username,
                  }

                  const lastText1 = {
                    id: req.body.senderId,
                    profilePicture: sender1.profilePicture,
                    seen: false,
                  }
  
                  const lastText2 = {
                    id: req.body.receiverId,
                    profilePicture: receive1.profilePicture,
                    seen: false,
                  }


                  const newConversation = new Conversation({
                    members: [member1, member2],
                    lastText: {
                      sender: "",
                      text: "",
                      seens: [lastText1,lastText2]
                    }
                  });
              
                    const savedConversation = await newConversation.save();
                    res.status(200).json(savedConversation);
                 
                    
                 
                } else {
                  !sender1 &&  res.status(500).json({content: "nguoi dung khong ton tai", status: 0});
                  !receive1 &&  res.status(500).json({content: "nguoi dung khong ton tai", status: 0});
                }
              

              })
              .catch(err => {
                res.status(500).json({content: err, status: 0});
              }) 
                
              
            
          
            
    }

    //get conv of a user

    async getCovOfUser(req, res, next) {
            try {
              const conversation = await Conversation.find({
                members: { $elemMatch: {id: req.params.userId} },
              });
              res.status(200).json({content: conversation, status: 1});
            } catch (err) {
              res.status(500).json(err);
            }
    }

    //Find conv by 2 userId
    async findCovByTwoId(req, res,next) {
            try {
              const conversation = await Conversation.findOne({
                members: { $all: [req.params.firstUserId, req.params.secondUserId] },
              });
              if(conversation) res.status(200).json({content: conversation, status: 1});
              const newCov = new Conversation({
                members: [req.params.firstUserId, req.params.secondUserId],
              })
              try {
                const savedConversation = await newCov.save();
                res.status(200).json({content: savedConversation, status: 1});
              } catch (err) {
                res.status(500).json(err);
              }
            } catch (err) {
              res.status(500).json(err);
            }
    }
    //updateConversation
    async update(req, res) {
      const {id, lastText} = req.body;
      try {
        const updateConversation = await Conversation.findByIdAndUpdate(id, {lastText});
        !updateConversation && res.status(500).json({content: "update fail", status: 0})
        res.status(200).json({content: "update sucees !", status: 1}); 
      } catch(err) {
        res.status(500).json({content: err, status:0})
      }
    }

}