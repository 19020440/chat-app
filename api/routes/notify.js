const router = require("express").Router();
const Notify = require('../models/Notify')
//Save Notify
router.post("/save-notify", async (req, res, next) => {
    const {userId, des, profilePicture} = req.body;

    const newNotify = new Notify({userId, des, profilePicture});
    try {
        const result = await newNotify.save();
        result && res.status(200).json({content: result, status: 1});
    } catch(err) {
        res.status(500).json({content: "Fail save notify!", status: 0})
    }
});


router.post("/get-list-notify", async (req, res, next) => {

    const {userId} = req.body;
    try {
        const listNotify = await Notify.find({userId}).exec();
        listNotify && res.status(200).json({content: listNotify, status: 1});
    } catch(err) {
        req.status(500).json({content: err, status: 0})
    }
    
    
    try {
        const result = await newNotify.save();
        result && res.status(200).json({content: result, status: 1});
    } catch(err) {
        res.status(500).json({content: "Fail save notify!", status: 0})
    }
});
//Xem thong bao

router.post('/update-seen-notify', async (req, res, next) => {
    const {notifyId} = req.body;
    try {
        const updateStatus = await Notify.findByIdAndUpdate(notifyId, {seen: true});
        updateStatus && res.status(200).json({content: updateStatus, status: 1});
    } catch(err) {
        res.status(500).json({content: err, status: 0})
    }
    
})


//delete all notify
router.post('/delete-all', async (req, res, next) => {
    const {userId} = req.body;
    try {
        const deleteAll = await Notify.deleteMany({userId});
        deleteAll && res.status(200).json({content: deleteAll, status: 1});
    } catch(err) {
        res.status(500).json({content: "Xóa thất bại!", status: 0})
    }
   
})




module.exports = router;
