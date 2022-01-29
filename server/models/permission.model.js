// Model for the config table
module.exports = (mongoose) => {
    var Permission = mongoose.model(
        "permission",
        mongoose.Schema({
            permissions: {
                required: true,
                default: ["create", "edit", "delete", "update", "authorise"],
            },
        })
    );
    return Permission;
};
