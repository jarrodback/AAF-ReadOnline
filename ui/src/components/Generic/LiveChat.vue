  <template>
    <div class="center login-div">

        <ul>
            <li
                v-for="(message, msg) in this.messages"
                :key="msg"
            >{{message.message}}</li>
        </ul>

        <b-form @submit.stop.prevent="handleSubmit">

            <b-form-input
                type="text"
                id="text-input"
                placeholder="Enter message"
                v-model="newMessage"
                autofocus
            ></b-form-input>
            <div class="submit-space">
                <b-button
                    type="submit"
                    v-on:click="sendMessage"
                    variant="primary"
                >Send</b-button>
            </div>

        </b-form>
    </div>
</template>

<script>
// import { store } from "../../store";
// import { io } from "socket.io-client";

/**
 * Component to display a live chat component.
 */
export default {
    name: "live-chat",

    /**
     * On app creation, connect the socket.
     */
    created() {
        // this.setupSocketConnection();
    },

    /**
     * Before the app unmounts, disconnect from the socket.
     */
    beforeUnmount() {
        // this.disconnect();
    },

    data() {
        // return {
        //     // socket: undefined,
        //     newMessage: "",
        //     messages: [],
        //     typing: false,
        //     info: [],
        // };
    },

    watch: {
        // newMessage(value) {
        //     value
        //         ? this.socket.emit("typing", store.getters.user.username)
        //         : this.socket.emit("stopTyping");
        // },
    },

    methods: {
        // handleSubmit(event) {
        //     event.preventDefault();
        // },
        // /**
        //  * Start the connection with the socket.
        //  */
        // setupSocketConnection() {
        //     this.socket = io("http://localhost:3050", {
        //         auth: {
        //             token: "abc",
        //         },
        //     });
        //     window.onbeforeunload = () => {
        //         this.socket.emit("leave", store.getters.user.username);
        //     };
        //     this.socket.emit("chat_join", store.getters.user.username);
        //     this.socket.on("chat_message", (data) => {
        //         this.messages.push({
        //             user: data.message.name,
        //             message: data.message.message,
        //         });
        //     });
        //     this.socket.on("typing", (data) => {
        //         this.typing = data;
        //     });
        //     this.socket.on("stopTyping", () => {
        //         this.typing = false;
        //     });
        //     this.socket.on("chat_join", function (data) {
        //         this.info.push({
        //             user: data,
        //             type: "connected",
        //         });
        //         setTimeout(() => {
        //             this.info = [];
        //         }, 5000);
        //     });
        //     this.socket.on("chat_leave", function (data) {
        //         this.info.push({
        //             user: data,
        //             type: "disconnected",
        //         });
        //         setTimeout(() => {
        //             this.info = [];
        //         }, 5000);
        //     });
        // },
        // sendMessage() {
        //     const msg = {
        //         user: store.getters.user.username,
        //         message: this.newMessage,
        //     };
        //     this.messages.push(msg);
        //     this.socket.emit("chat_message", {
        //         message: msg,
        //     });
        //     this.newMessage = "";
        // },
        // /**
        //  * On disconnect, disconnect from the socket.
        //  */
        // disconnect() {
        //     if (this.socket) {
        //         this.socket.disconnect();
        //     }
        // }
    },
};
</script>



