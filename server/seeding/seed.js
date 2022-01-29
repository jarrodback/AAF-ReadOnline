const mongoose = require("mongoose");
mongoose.requests = require("../models/request.model")(mongoose);
mongoose.users = require("../models/user.model")(mongoose);
mongoose.configs = require("../models/config.model")(mongoose);
mongoose.notifications = require("../models/notification.model")(mongoose);
const bcrypt = require("bcryptjs");

const requests = [
    {
        _id: "123456789121",
        name: "My Book",
        datePublished: new Date(),
        cost: 40,
        author: "My Author",
        type: "Book",
        requestingUser: "987654321121",
        status: "Approved",
    },
    {
        _id: "123456789122",
        name: "The AudioBook",
        datePublished: new Date(),
        cost: 5.03,
        author: "The author of the book",
        type: "Audiobook",
        requestingUser: "987654321121",
        status: "Pending Review",
    },
    {
        _id: "123456789123",
        name: "The Magazine",
        datePublished: new Date(),
        cost: 5.33,
        author: "The author of the magazine",
        type: "Magazine",
        requestingUser: "987654321123",
        status: "Pending Review",
    },
    {
        _id: "123456789125",
        name: "My Book 1",
        datePublished: new Date(),
        cost: 40,
        author: "My Author",
        type: "Book",
        requestingUser: "987654321126",
        status: "Pending Review",
    },
    {
        _id: "123456789126",
        name: "The AudioBook 1",
        datePublished: new Date(),
        cost: 5.03,
        author: "The author of the book",
        type: "Audiobook",
        requestingUser: "987654321126",
        status: "In Review",
    },
    {
        _id: "123456789127",
        name: "The Magazine 1",
        datePublished: new Date(),
        cost: 5.33,
        author: "The author of the magazine",
        type: "Magazine",
        requestingUser: "987654321126",
        status: "Needs More Information",
    },
    {
        _id: "123456789117",
        name: "The Magazine 2",
        datePublished: new Date(),
        cost: 5.33,
        author: "The author of the magazine",
        type: "Magazine",
        requestingUser: "987654321126",
        status: "Needs Authorisation",
    },
    {
        _id: "123456789136",
        name: "The AudioBook 3",
        datePublished: new Date(),
        cost: 5.03,
        author: "The author of the book",
        type: "Audiobook",
        requestingUser: "987654321126",
        status: "Purchased",
    },
    {
        _id: "123456789137",
        name: "The Magazine 3",
        datePublished: new Date(),
        cost: 5.33,
        author: "The author of the magazine",
        type: "Magazine",
        requestingUser: "987654321126",
        status: "Declined",
    },
];

const users = [
    {
        _id: "987654321121",
        username: "jarrodback",
        email: "test@test.com",
        requests: ["123456789122", "123456789121"],
        password: bcrypt.hashSync("test1", 8),
        role: "Admin",
        dateCreated: 946684800,
    },
    {
        _id: "987654321123",
        username: "usER3",
        email: "test3@test.com",
        requests: [],
        password: bcrypt.hashSync("test3", 8),
        role: "Employee",
        dateCreated: new Date(),
    },
    {
        _id: "987654321122",
        username: "usER1",
        email: "test2@test.com",
        requests: [],
        password: bcrypt.hashSync("test2", 8),
        role: "User",
        dateCreated: new Date(),
    },
    {
        _id: "987654321126",
        username: "user_rbo",
        email: "user@rbo.com",
        requests: [],
        password: bcrypt.hashSync("f", 8),
        role: "User",
        dateCreated: new Date(),
    },
    {
        username: "employee",
        email: "employee@rbo.com",
        requests: [],
        password: bcrypt.hashSync("password123", 8),
        role: "Employee",
        dateCreated: new Date(),
    },
    {
        username: "admin",
        email: "admin@rbo.com",
        requests: [],
        password: bcrypt.hashSync("admin", 8),
        role: "Admin",
        dateCreated: new Date(),
    },
];

const config = [
    {
        _id: "config",
        costThreshold: 100,
    },
];

const notifications = [
    {
        _id: "555555555555",
        username: "user1",
        message: "example",
    },
    {
        _id: "655555555555",
        username: "user2",
        message: "example",
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
    await mongoose.configs.deleteMany();
    await mongoose.configs.insertMany(config);
    await mongoose.notifications.deleteMany();
    await mongoose.notifications.insertMany(notifications);
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
