const mongoose = require("mongoose");
mongoose.requests = require("../models/request.model")(mongoose);
mongoose.users = require("../models/user.model")(mongoose);

const requests = [
    {
        _id: "123456789121",
        name: "My Book",
        datePublished: new Date(),
        cost: 40,
        author: "My Author",
        type: "Book",
        requestingUser: "61dd56a297402ee89224efb2",
        status: "Accepted",
    },
    {
        _id: "123456789122",
        name: "The AudioBook",
        datePublished: new Date(),
        cost: 5.03,
        author: "The author of the book",
        type: "Audiobook",
        requestingUser: "61dd56a297402ee89224efb2",
        status: "Pending Review",
    },
];

const users = [
    {
        _id: "987654321121",
        username: "jarrodback",
        email: "b8043407@my.shu.ac.uk",
        requests: ["123456789122", "123456789121"],
        role: "Admin",
        dateCreated: 946684800,
    },
    {
        _id: "987654321122",
        username: "usER1",
        email: "user1@my.shu.ac.uk",
        requests: [],
        role: "User",
        dateCreated: Date.now(),
    },
];

mongoose
    .connect("mongodb://localhost:27017/readonlinedb_testing", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection to database successful.");
    })
    .catch(() => {
        console.log("Connection to database successful.");
    });

const seedDB = async () => {
    await mongoose.requests.deleteMany();
    await mongoose.requests.insertMany(requests);
    await mongoose.users.deleteMany();
    await mongoose.users.insertMany(users);
};

seedDB()
    .then(() => {
        console.log("Successfully seeded database.");
    })
    .catch((error) => {
        console.log("An error occurred while seeding databases: ", error);
    })
    .finally(() => {
        mongoose.connection.close();
    });