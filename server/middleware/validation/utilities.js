const ObjectId = require("mongoose").Types.ObjectId;

/**
 * Generic functions for validation. (Majority are in the relevant service files)
 */

/**
 * Check ID is a valid mongoose ObjectId
 */
module.exports = {
    isIdValid(id) {
        return ObjectId.isValid(id);
    },
};
