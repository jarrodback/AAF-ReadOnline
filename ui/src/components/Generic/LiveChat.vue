  <template>
    <div
        v-if="show"
        class="chat"
        id="chat-box"
    >
        <div
            class="messages"
            id="message-box"
        >
            <p v-if="supportNotConnected"> Please wait for support to join... </p>
            <p
                class="message"
                :class="{ 'message-out': message.type === 'sent', 'message-in': message.type === 'receieved', 'message-info': message.type=== 'info' }"
                v-for="(message, msg) in this.messages"
                :key="msg"
            >{{message.message}}</p>
            <p
                class="typing"
                v-if="isTyping"
            > {{this.typing}} is typing... </p>
        </div>

        <b-form
            class="form-chat"
            @submit.stop.prevent="handleSubmit"
        >

            <b-form-input
                v-bind:disabled="supportNotConnected"
                type="text"
                id="text-input"
                placeholder="Enter message"
                v-model="newMessage"
                autofocus
            ></b-form-input>
            <b-button
                v-bind:disabled="supportNotConnected"
                type="submit"
                v-on:click="sendMessage"
                variant="primary"
            >Send</b-button>

        </b-form>

        <b-icon
            id="notification-dismiss"
            class="h2 pointer topright"
            icon="x"
            aria-label="Clear Notification"
            v-on:click="disconnect"
        ></b-icon>

    </div>

</template>

<script>
import { store } from "../../store";
import { io } from "socket.io-client";
import { api } from "../../helpers/helpers";

/**
 * Component to display a live chat component.
 */
export default {
    name: "live-chat",

    /**
     * Before the app unmounts, disconnect from the socket.
     */
    beforeUnmount() {
        console.log("called");
        this.socket.emit("chat_leave", store.getters.user.username);
        // Send api call to {messages} onto the request.messages.
        this.disconnect();
    },

    data() {
        return {
            // socket: undefined,
            newMessage: "",
            // stores the messages
            messages: [],
            // Is the other user typing
            typing: false,
            // Have we told server we are typing
            sentTyping: false,
            // Should we show the chat
            show: false,
            // Has the other person connected
            supportNotConnected: true,
            // stores the request
            request: {},
        };
    },

    computed: {
        /**
         * Is a user typing
         */
        isTyping() {
            return this.typing != false;
        },
    },

    watch: {
        /**
         * Watch for newMessage data to change send the correct typing event.
         */
        newMessage(value) {
            if (value && this.sentTyping == false) {
                this.socket.emit("typing", store.getters.user.username);
                this.sentTyping = true;
            } else if (value == "" && this.sentTyping == true) {
                this.socket.emit("stopTyping", store.getters.user.username);
                this.sentTyping = false;
            }
        },
    },

    methods: {
        handleSubmit(event) {
            event.preventDefault();
        },
        /**
         * Start the connection with the socket.
         */
        setupSocketConnection(request) {
            // Set socket info and setup environment.
            if (store.getters.user.role != "User") {
                this.supportNotConnected = false;
            }
            this.request = request;
            this.messages = request.chatHistory;
            this.show = true;
            this.socket = io("http://localhost:3050", {
                auth: {
                    token: "abc",
                },
            });

            // Send server chat join event
            this.socket.emit("chat_join", {
                user: store.getters.user.username,
                requestId: request._id,
            });

            // When a message is sent
            this.socket.on("chat_message", (data) => {
                this.messages.push({
                    user: data.message.user,
                    message: data.message.message,
                    time: data.message.time,
                    type: "receieved",
                });
                this.scrollChat();
            });

            // On a typing event
            this.socket.on("typing", (data) => {
                this.typing = data;
            });

            // On a stop typing event
            this.socket.on("stopTyping", () => {
                this.typing = false;
            });

            // On chat join event
            this.socket.on("chat_join", (data) => {
                this.messages.push({
                    user: data.user,
                    message: data.user + " has joined.",
                    type: "info",
                    time: Date.now(),
                });
                this.supportNotConnected = false;
            });

            // On chat leave event
            this.socket.on("chat_leave", (data) => {
                this.messages.push({
                    user: data.user,
                    message: data.user + " has left.",
                    type: "info",
                    time: Date.now(),
                });

                this.scrollChat();
            });
        },

        /**
         * Send a message to the server.
         */
        sendMessage() {
            if (this.newMessage.trim().length !== 0) {
                const msg = {
                    user: store.getters.user.username,
                    message: this.newMessage,
                    time: Date.now(),
                };
                this.socket.emit("chat_message", {
                    message: msg,
                });
                this.messages.push({
                    ...msg,
                    type: "sent",
                    time: Date.now(),
                });

                this.newMessage = "";

                this.scrollChat();
            }
        },

        /**
         * Scroll the lastest message.
         */
        scrollChat() {
            setTimeout(function () {
                let messages = document.getElementsByClassName("message");
                let lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                    lastMessage.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                    });
                }
            }, 100);
        },

        /**
         * On disconnect, disconnect from the socket.
         */
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
            }
            this.show = false;

            const payload = {
                _id: this.request._id,
                chatHistory: this.messages,
            };
            api.updateRequest(payload);
        },
    },
};
</script>
