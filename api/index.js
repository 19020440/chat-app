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
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({content: req.body.name , status: 1});
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
  console.log("a user connected.", socket.id);

  socket.on("validLogin", () => {
    socket.emit("setvalidLogin", socket.id);
  })

  //first_join_room
  socket.on("first_join_room", data => {
    console.log(data);
    socket.join(data);
  })

  //join room
  socket.on("join_room", async ({senderId, conversationId,receiveId}) => { 
    // try {
    //   const updateStatusSeen = await Messenger.updateMany(
    //     {$and:[{sender: receiveId},{seens:false}, {conversationId}]},
    //      {seens: true});
    //      const updateConversation = await Conversation.update(
    //        {$and: [{_id: conversationId}, {'lastText.sender': receiveId}]},
    //         {'lastText.seens': true })
    // } catch(err) {
    //   console.log(err);
    // }
    // socket.join(conversationId);
    console.log("conversation join room: ",conversationId);
    socket.to(conversationId).emit("setJoin_room", {senderId, conversationId});
  })

  //ANswer join room
  socket.on("answer_join_room", ({conversationId,receiveId}) => {
    socket.to(conversationId).emit("answer_join_room", {conversationId,senderId: receiveId})
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
    // console.log("sendMessage: ", res.conversationId);
    try {
      // const user = await User.findById(receiverId).exec();
      // console.log("this is user: ",user);
      socket.to(res.conversationId).emit("getMessage", res);
    }catch(err) {

    }
    
  });

//OOFLINE
  socket.on("userOffline", async(userId) => {
    // console.log("this is offline :" ,userId);
    io.emit("setUserOffline", userId);
  })

  //ONLINE
  socket.on("online", async ({email, id,arrCovId}) => {
    console.log("email is: ", id);
    try {
     
      const removeSocketId = await User.findOneAndUpdate({email}, {socketId: id});
      removeSocketId && socket.to(arrCovId).emit('setOnline', arrCovId)
     

    } catch(err) {

    }
 
  })
  //ANSWER_ONLINE
  socket.on("answerOnline", covId => {
    socket.to(covId).emit("receive_anwerOnline", covId)
  })

  //call video
  socket.on("join room", async ({roomID,from}) => {
    
      try {
        const userF = await User.findById(from).exec();
        if (users[roomID]) {
          const length = users[roomID].length;
          if (length === 4) {
              socket.emit("room full");
              return;
          }
          users[roomID].push(socket.id);
        } else {
              users[roomID] = [socket.id];
              const memberInRoom = await Conversation.findById(roomID).exec();
              
              !memberInRoom && socket.emit('log bug', "Conversation not exist");
              const membersA = memberInRoom.members.filter(item => item!=from);
              membersA.forEach(async (item) => {
                const user = await User.findById(item).exec();
                io.to(user?.socketId).emit("callUser", {roomID,from: userF});
              })
              socket.on("callUser", (data) => {

              })
        }
       
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
  
      socket.emit("all users", usersInThisRoom);
      } catch(err) {
        console.log(err);
      }
    
  

   
    
});

socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
});

socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
});




  //when disconnect
  socket.on("disconnect", async () => {
    console.log("DISCONEXT!");
    try { 
      
      const removeSocketId = await User.findOneAndUpdate({socketId: socket.id}, {socketId: "",status: false});
      console.log(removeSocketId);
     const id = removeSocketId._id.toString();
     
      const conversations = await Conversation.find({
        members: { $elemMatch: {id: id} },
      });
      const arrCov = conversations.map((value) => {
        return value._id.toString();
      })
     
      socket.to(arrCov).emit("setUserOffline",arrCov);
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
