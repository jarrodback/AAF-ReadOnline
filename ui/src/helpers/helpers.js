import axios from "axios";

/**
 * Constants that define the API urls.
 */
const BASE_REQUESTS_URL = "http://localhost:3050/readonline/requests/";
const BASE_USERS_URL = "http://localhost:3050/usermanagement/users/";
const BASE_AUTH_URL = "http://localhost:3050/auth/";
const BASE_NOTIFY_URL = "http://localhost:3050/notify/notifications/";

/**
 * Object that holds every API request.
 */
export const api = {
    /*********************************
     *            Auth               *
     ********************************/
    /**
     * Send a request to Login.
     *
     * @param {Object} payload The login data.
     * @returns {Promise}
     */
    login: async (payload) => {
        return axios.post(BASE_AUTH_URL + "login", payload, {
            withCredentials: true,
        });
    },

    /**
     * Send a request to register.
     *
     * @param {Object} payload The register data.
     * @returns {Promise}
     */
    register: async (payload) => {
        const res = await axios.post(BASE_AUTH_URL + "register", payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to logout.
     *
     * @param {Object} payload The login data.
     * @returns {Promise}
     */
    logout: async () => {
        return axios.post(BASE_AUTH_URL + "logout", {
            withCredentials: true,
        });
    },

    /*********************************
     *          Requests             *
     ********************************/

    /**
     * Send a request to get a Request.
     *
     * @param {String} id The id of the request to get.
     * @returns {Promise}
     */
    getRequest: async (id) => {
        const res = await axios.get(BASE_REQUESTS_URL + id, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to get all Requests.
     *
     * @param {Object} query The data to query the results with.
     * @returns {Promise}
     */
    getRequests: async (query) => {
        var condition = "";
        if (query) {
            condition = query;
        }
        const res = await axios.get(BASE_REQUESTS_URL + condition, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to delete a Request.
     *
     * @param {String} id The id of the request to delete.
     * @returns {Promise}
     */
    deleteRequest: (id) => {
        const res = axios.delete(BASE_REQUESTS_URL + id, {
            withCredentials: true,
        });
        return res;
    },

    /**
     * Send a request to create a Request.
     *
     * @param {Object} payload The data of the request to create.
     * @returns {Promise}
     */
    createRequest: async (payload) => {
        const res = await axios.post(BASE_REQUESTS_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to update a Request.
     *
     * @param {Object} payload The data of the request to update.
     * @returns {Promise}
     */
    updateRequest: async (payload) => {
        const res = await axios.put(BASE_REQUESTS_URL + payload._id, payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /*********************************
     *            Users              *
     ********************************/

    /**
     * Send a request to get a User.
     *
     * @param {String} id The data of the user to get.
     * @returns {Promise}
     */
    getUser: async (id) => {
        const res = await axios.get(BASE_USERS_URL + id, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to get all Users.
     *
     * @returns {Promise}
     */
    getUsers: async () => {
        const res = await axios.get(BASE_USERS_URL, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to delete a User.
     *
     * @param {String} id The id of the user to delete.
     * @returns {Promise}
     */
    deleteUser: (id) => {
        const res = axios.delete(BASE_USERS_URL + id, {
            withCredentials: true,
        });
        return res;
    },

    /**
     * Send a request to create a User.
     *
     * @param {Object} payload The data of the user to create.
     * @returns {Promise}
     */
    createUser: async (payload) => {
        const res = await axios.post(BASE_USERS_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to update a User.
     *
     * @param {Object} payload The data of the user to update.
     * @returns {Promise}
     */
    updateUser: async (payload) => {
        const res = await axios.put(BASE_USERS_URL + payload._id, payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /*********************************
     *        Notifications          *
     ********************************/

    /**
     * Send a request to create a Notification.
     *
     * @param {Object} payload The data of the notification to create.
     * @returns {Promise}
     */
    createNotification: async (payload) => {
        const res = await axios.post(BASE_NOTIFY_URL, payload, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to get all Notifications.
     *
     * @param {Object} query The data to query the results with.
     * @returns {Promise}
     */
    getNotifications: async (query) => {
        var condition = "";
        if (query) {
            condition = query;
        }
        const res = await axios.get(BASE_NOTIFY_URL + condition, {
            withCredentials: true,
        });
        return res.data;
    },

    /**
     * Send a request to delete a Notification.
     *
     * @param {String} id The data of the notification to delete.
     * @returns {Promise}
     */
    deleteNotification: (id) => {
        const res = axios.delete(BASE_NOTIFY_URL + id, {
            withCredentials: true,
        });
        return res;
    },
};

/**
 * Send a toast notification to the client.
 *
 * @param {String} context The context of the scope.
 * @param {String} message The message to show.
 * @param {String} type The type of toast. E.g. Success, error.
 * @param {Boolean} showClose True if user should be able to manually close the toast.
 */
export const notify = (context, message, type, showClose = true) =>
    context.$notify({
        message: message,
        type: type,
        top: true,
        right: true,
        showClose: showClose,
    });
