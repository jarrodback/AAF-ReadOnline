const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
    isIdValid(id) {
        return ObjectId.isValid(id);
    },
};
