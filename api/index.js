const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
const User = require('./models/User');
const Messenger = require('./models/Message');
const Conversation = require("./models/Conversation");
const fs = require('fs')

const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const io  = new Server(server, {
  cors: {
      origin: 'http://localhost:3000',
      methods: ["get", "post", "delete"]
  }
})

dotenv.config();

mongoose.connect(
  'mongodb://localhost:27017/chatting2',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(cors(
  {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST","DELETE","PUT"],
      credentials: true,
    }
));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if(req.body.userId) {
      const result = await User.findByIdAndUpdate(req.body.userId, {profilePicture: `${req.body.name}`});
      // req.body.arrCov.forEach(items => {
      //     Promise.all([  Conversation.update(
      //       {$and: [{_id: items}, {'lastText.seens.id': req.body.userId,}]},
            
      //         {
      //         $set:  {'lastText.seens.$.profilePicture': `http://localhost:8800/images/${req.body.name}` },
      //       }
      //         ),   Conversation.update(
      //           {$and: [{_id: items}, {'members.id': req.body.userId,}]},
                
      //             {
      //             $set:  {'members.$.profilePicture': `http://localhost:8800/images/${req.body.name}` },
      //           }
      //             )  ])
      // })
      return res.status(200).json({content: req.body.name , status: 1});
    } else {
        const raw = new Buffer.from (req.body.base, 'base64');
        const nameFile = Date.now();
        fs.writeFile(`public/images/${nameFile}.png`, raw, function(err) {
          if (err) throw err;

          res.status(200).json({content: `${nameFile}.png`, status: 1})
        })
    }
   
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/upload/delete",upload.single("file"),async (req, res) => {
    await unlinkAsync(path.join(__dirname, `public/images/${req.body.path}`))
    res.json({content: "succes", status: 1})
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


//SOCKETIO
const users = {};
const socketToRoom = {};


io.on("connection", (socket) => {
  //when ceonnect

  socket.on("validLogin", () => {
    socket.emit("setvalidLogin", socket.id);
  })

  //first_join_room
  socket.on("first_join_room", data => {
    socket.join(data);
    socket.emit("first_join_room", true);
  })

  //join room
  socket.on("join_room", async ({senderId, conversationId}) => { 
    try {


            // const updateStatusSeen = await Messenger.update(
            //   {$and:[{conversationId},{'seens.id': senderId}, {'seens.seen': false}]},
            //   {$set: {seen: true,"seens.$.seen": true}});

            const updateConversation = await Conversation.update(
              {$and: [{_id: conversationId}, {'lastText.seens.id': senderId}]},
              
                {
                $set:  {'lastText.seens.$.seen': true },
              }
                ) 
          
    } catch(err) {
      socket.emit("send_error", "gặp vấn đề khi join phòng!")
    }
    // socket.join(conversationId);
    console.log("conversation join room: ",conversationId);
    socket.to(conversationId).emit("setJoin_room", {senderId, conversationId});
  })

  socket.on("answer_join_room", ({conversationId, senderId}) => {
    socket.to(conversationId).emit("answer_join_room", {conversationId, senderId})
  })

  //chinh suar biet danh
  socket.on("edit_bietdanh", (data) => {
    socket.to(data.conversationId).emit("edit_bietdanh", data);
  })

  //sua ten nhom
  socket.on("edit_tennhom", data => {
    socket.to(data.conversationId).emit("edit_tennhom", data)
  })
  //xoa thanh vien
  socket.on("delete_user", (data) => {
    socket.to(data.conversationId).emit("delete_user", data);
  })
  //leave group
  socket.on("leave_group", (data) => {
    console.log("leave_room");
    socket.to(data.conversationId).emit("leave_group", data);
  })

  //invite_join_group
  socket.on('invite_to_group', async ({name,members, listUser, user}) => {
      try {
        const newConversation = new Conversation({
          name: name,
          members,
          lastText: {
            sender: "",
            text: "",
            seens: members
          }
        });
        console.log("listUser:", listUser);
        const result = await newConversation.save();
        result && socket.emit("status_invite_to_group", true)
        !result && socket.emit("status_invite_to_group", false)
        listUser.forEach( (element) => {
              User.findById(element).then(res => {
                socket.to(res.socketId).emit("invite_to_group", {name, user})
              })
        });
      } catch(err) {
        console.log(err);
      }
  })
 

  //out ROOM
  socket.on("out_room", ({senderId, conversationId}) => {
    console.log("out room with socket: ", {senderId, conversationId});
    // socket.leave(conversationId);
    socket.to(conversationId).emit("setout_room", {senderId, conversationId});
  })

  //take userId and socketId from user
  socket.on("addUser", async (userId) => {
    try {
      const updateSocketId = await User.findByIdAndUpdate(userId, {socketId: socket.id});
    } catch(err) {
      console.log(err);
    }
  });

  //send and get message
  socket.on("sendMessage", async (res) => {
    try {
      socket.to(res.conversationId).emit("getMessage", res);
    }catch(err) {

    }
    
  });

//OOFLINE
  socket.on("userOffline", async({userId,arrCov}) => {
    // console.log("this is offline :" ,userId);
    
    socket.to(arrCov).emit("setUserOffline", {userId, arrCov});
    // socket.leave(arrCov)
  })

  //ONLINE
  socket.on("online", async ({email, id,arrCovId}) => {
    console.log("email is: ", id);
    try {
     
      const removeSocketId = await User.findOneAndUpdate({email}, {socketId: id});
      removeSocketId && socket.to(arrCovId).emit('setOnline', {arrCovId, userOnlineId: removeSocketId._id.toString()})
     

    } catch(err) {

    }
 
  })
  //ANSWER_ONLINE
  socket.on("answerOnline", ({covId, userId}) => {
    console.log("answser online:", userId);
    socket.to(covId).emit("receive_anwerOnline", {covId, userId})
  })

  //call video
  socket.on("join room", async ({roomId,from,newRoomId,status}) => {
    socket.join(newRoomId)
    if (users[newRoomId]) {
      const length = users[newRoomId].length;
      if (length === 4) {
          socket.emit("room full");
          return;
      }
      users[newRoomId].push(socket.id);
      } else {
          users[newRoomId] = [socket.id];
      }
      console.log("user in room: ", users);
      socketToRoom[socket.id] = newRoomId;
      const usersInThisRoom = users[newRoomId].filter(id => id !== socket.id);
      socket.emit("all users", usersInThisRoom);

      
      try {
        if(status != 1) {
          const userF = await User.findById(from).exec();
          socket.to(roomId).emit("callUser", {roomId,from: userF});
        }
        
      } catch(err) {
        console.log(err);
      }

  });

  socket.on("sending signal", payload => {

    socket.to(payload.roomID).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
});



  socket.on("returning signal", payload => {
    socket.to(payload.roomID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
});

//Gui loi moi ket ban 
  socket.on("invite_success", async (data) => {
    try {
      const user = await User.findById(data.userId).exec();
      user && socket.to(user.socketId).emit("invite_success", {username: data.name, profilePicture: data.profilePicture});
    } catch(err) {
      socket.emit("send_error", "Kết bạn thành công nhưng có thể người dùng sẽ chưa thấy lời mời của bạn!")
    }
  })


  //when disconnect
  socket.on("disconnect", async () => {
    console.log("DISCONEXT!");
    try { 
      
      const removeSocketId = await User.findOneAndUpdate({socketId: socket.id}, {socketId: "",status: false});
     const id = removeSocketId._id.toString();
     
      const conversations = await Conversation.find({
        members: { $elemMatch: {id: id} },
      });
      const arrCov = conversations.map((value) => {
        return value._id.toString();
      })
     
      socket.to(arrCov).emit("setUserOffline",{userId: id, arrCov});
    }catch(err) {
      console.log(err);
    }
    

    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
    }
  });
});


server.listen(8800, () => {
  console.log("Backend server is running!");
});
