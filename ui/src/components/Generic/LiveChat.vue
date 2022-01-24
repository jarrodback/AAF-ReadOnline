  <template>
    <div class="center login-div">

        <ul class="messages">
            <li
                v-for="(message, msg) in messages"
                :key="msg"
            >{{message.name}}: {{message.message}}</li>
        </ul>

        <b-form @submit.stop.prevent="handleSubmit">

            <b-form-input
                type="text"
                id="text-input"
                placeholder="Enter message"
                v-model="currentMessage"
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
import { store } from "../../store";
import { io } from "socket.io-client";

/**
 * Component to display a live chat component.
 */
export default {
    name: "live-chat",

    /**
     * On app creation, connect the socket.
     */
    mounted() {
        this.setupSocketConnection();
    },

    /**
     * Before the app unmounts, disconnect from the socket.
     */
    beforeUnmount() {
        this.disconnect();
    },

    data() {
        return {
            socket: undefined,
            messages: [],
            currentMessage: "",
        };
    },

    methods: {
        handleSubmit(event) {
            event.preventDefault();
        },

        sendMessage() {
            const msg = {
                name: store.getters.user.username,
                message: this.currentMessage,
            };
            this.messages.push(msg);
            this.currentMessage = "";

            this.socket.emit("chat_message", {
                message: msg,
            });
        },

        /**
         * Start the connection with the socket.
         */
        setupSocketConnection() {
            let messages = [];
            this.socket = io("http://localhost:3050", {
                auth: {
                    token: "abc",
                },
            });

            this.socket.emit("chat_join", store.getters.user.username);

            this.socket.on("chat_message", function (data) {
                console.log("CHAT MESSSAGE: ", data);
                this.messages.push({
                    name: data.message.name,
                    message: data.message.message,
                });
            });

            this.socket.on("chat_join", function (data) {
                console.log("someones joined");
                messages.push({
                    name: data,
                    message: " just joined the chat.",
                });
                this.messages = messages;
                console.log(this.messages);
            });

            this.socket.on("chat_leave", function (data) {
                this.messages.push({
                    name: data,
                    message: " just left the chat.",
                });
            });
        },

        /**
         * On disconnect, disconnect from the socket.
         */
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
            }
        },
    },
};
</script>



