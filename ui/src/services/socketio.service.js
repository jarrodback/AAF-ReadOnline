// import { io } from "socket.io-client";

// class SocketioService {
//     socket;
//     constructor() {}

//     /**
//      * Start the connection with the socket.
//      */
//     setupSocketConnection() {
//         this.socket = io("http://localhost:3050", {
//             auth: {
//                 token: "abc",
//             },
//         });

//         this.socket.emit("message", "Hey dickhead");

//         this.socket.on("broadcast", (data) => {
//             console.log("broadcast: ", data);
//         });
//     }

//     /**
//      * On disconnect, disconnect from the socket.
//      */
//     disconnect() {
//         if (this.socket) {
//             this.socket.disconnect();
//         }
//     }

//     message(message) {
//         this.socket.emit("chat_message", {
//             message: message,
//         });
//     }
// }

// export default new SocketioService();
