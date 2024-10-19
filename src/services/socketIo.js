

const socketIo_Config = (io) => {
    let users = []; // Array to store connected users
    
    // Event listener for new client connection
    io.on("connect", (socket) => {
        console.log("A client connected");
        io.emit('welcome', "this is server hi socket");

        // Event listener for client disconnection
        socket.on("disconnect", () => {
            console.log("A client disconnected");
            console.log('log usersss...',users);
            removeUser(socket.id);
            io.emit('getUsers', users);
        });

        // Function to remove user from users array
        const removeUser = (socketId) => {
            users = users.filter(user => user.socketId !== socketId);
        };

        // Function to add user to users array
        const addUser = (userId, socketId) => {
            !users.some(user => user.userId === userId) &&
                users.push({ userId, socketId });
        };

        // Function to get user from users array
        const getUser = (userId) => {
            return users.find(user => user.userId === userId);
        };

        // Event listener for adding user
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id);
            console.log('userererer',users);
            io.emit('getUsers', users);
            
        });

        // Event listener for sending message
        socket.on("sendMessage", ({ senderId, recieverId, text }) => {
          
            const user = getUser(recieverId);
            console.log(senderId,'message is sended to',recieverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", { senderId, text, recieverId });
            } else {
                console.log("User not found");
            }
        });

        // Event listener for "typing" event from client
        socket.on("typing", ({ senderId, recieverId }) => {
            const user = getUser(recieverId);
            if (user) {
                io.to(user.socketId).emit("userTyping", { senderId, recieverId });
            }
        });

        // Event listener for "stopTyping" event from client
        socket.on("stopTyping", ({ senderId, recieverId }) => {
            const user = getUser(recieverId);
            if (user) {
                io.to(user.socketId).emit("userStopTyping", { senderId,recieverId });
            }
        });

        // Event listener for "messageRead" event from client
        socket.on("messageRead", ({ senderId, recieverId }) => {
           
            const user = getUser(senderId);
            if (user) {
                io.to(user.socketId).emit("messageReadByRecipient", { senderId, recieverId });
            } else {
                console.log("User not found");
            }
        });

        // Event listener for "deleteMessage" event from client
        socket.on("deleteMessage", ({ index, deleteType, recieverId }) => {
            const user = getUser(recieverId);
            if (user) {
                const deletedMessageIndex = index;
                io.to(user.socketId).emit('messageDeleted', { deletedMessageIndex, deleteType });
            } else {
                console.log('User not found');
            }
        });

        socket.on('fetchOnline',({userId})=>{
           const user = getUser(userId)
           console.log('inininnnnisssssssdsfdsfas');
           if(user){
            io.to(user.socketId).emit('getUsers', users);
           }else{
            console.log('User not found');
           }
        })

        socket.on('notification-sent',({message,senderId,recieverId})=>{
            const user = getUser(recieverId)
           console.log('inininnnnisssssssdsfdsfas',message,senderId,recieverId);
           if(user){
            console.log(user.socketId);
            io.to(user.socketId).emit('notification-get',{message,senderId});
           }else{
            console.log('User not found');
           }
        })

        socket.on('videoCallEmit',({userName,profilePic,recieverId,roomId})=>{
            console.log('userName',userName,recieverId);
            const user = getUser(recieverId)
            if(user){
                console.log(user.socketId);
                io.to(user.socketId).emit('videoCallon',{userName,profilePic,roomId});
               }else{
                console.log('User not found');
               }
        })
    });
};

module.exports = socketIo_Config;

