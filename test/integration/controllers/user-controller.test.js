let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../app");
let should = chai.should();

chai.use(chaiHttp);

const user1 = "987654321121";
const fakeId = "111111111111";
const invalidId = "a";

var token;

before(function (done) {
    chai.request(server)
        .post("/auth/login")
        .send({
            email: "test@test.com",
            password: "test1",
        })
        .end((err, res) => {
            token = res.body.token;

            done();
        });
});

describe("Testing the /usermanagement/users path", () => {
    describe("POST /usermanagement/users", () => {
        it("it should not create a User without all required fields", (done) => {
            let request = {};
            chai.request(server)
                .post("/usermanagement/users")
                .set({ Authorization: `Bearer ${token}` })
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("User data is invalid.");

                    done();
                });
        });

        it("it should fail to create a User with a username <5", (done) => {
            let request = {
                username: "user",
                email: "user2@my.shu.ac.uk",
                password: "password",
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/usermanagement/users")
                .set({ Authorization: `Bearer ${token}` })
                .send(request)
                .end((err, res) => {
                    // res.should.have.status(404);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql(
                            "user validation failed: username: Your username must be at least 5 letters."
                        );

                    done();
                });
        });

        it("it should create a User", (done) => {
            let request = {
                username: "user2",
                email: "user2@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/usermanagement/users")
                .set({ Authorization: `Bearer ${token}` })
                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql("User was successfully created.");

                    done();
                });
        });
    });

    describe("GET /usermanagement", () => {
        it("it should return a welcome message", (done) => {
            chai.request(server)
                .get("/usermanagement")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql("Welcome to the user management API.");

                    done();
                });
        });
    });

    describe("GET /usermanagement/users", () => {
        it("it should get all the Users", (done) => {
            chai.request(server)
                .get("/usermanagement/users")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(5);

                    done();
                });
        });

        it("it should return 404 if no User was found", (done) => {
            chai.request(server)
                .get("/usermanagement/users/" + fakeId)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Could not find record.");

                    done();
                });
        });

        it("it should return 404 if User Id was invalid", (done) => {
            chai.request(server)
                .get("/usermanagement/users/" + invalidId)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("User ID is invalid.");

                    done();
                });
        });

        it("it should GET the User", (done) => {
            chai.request(server)
                .get("/usermanagement/users/" + user1)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("_id");
                    res.body.should.have.property("username").eql("jarrodback");
                    res.body.should.have.property("email");
                    res.body.should.have.property("requests");
                    res.body.should.have.property("dateCreated");
                    res.body.should.have.property("role");

                    done();
                });
        });
    });

    describe("UPDATE /usermanagement/users/" + user1, () => {
        it("it should update a User", (done) => {
            let to_update = {
                username: "backjarrod",
            };
            chai.request(server)
                .put("/usermanagement/users/" + user1)
                .set({ Authorization: `Bearer ${token}` })
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/usermanagement/users/" + user1)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("object");
                    res.body.should.have.property("username").eql("backjarrod");

                    done();
                });
        });

        it("if the User to update isn't found it should return 404", (done) => {
            let to_update = {
                username: "bob12",
            };
            chai.request(server)
                .put("/usermanagement/users/" + fakeId)
                .set({ Authorization: `Bearer ${token}` })
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Could not find record.");

                    done();
                });
        });
    });

    describe("DELETE /usermanagement/users/" + user1, () => {
        it("it should delete a User", (done) => {
            chai.request(server)
                .delete("/usermanagement/users/" + user1)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    it("it should not delete a User with an invalid id", (done) => {
        chai.request(server)
            .delete("/usermanagement/users/" + fakeId)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have
                    .property("message")
                    .eql("Could not find record.");

                done();
            });
    });

    describe("Endpoints should reject user when not authenticated", () => {
        it("Unauthenticated user shouldn't be able to view requests", (done) => {
            chai.request(server)
                .get("/usermanagement/users/")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql(
                        "Unauthorized: No token provided."
                    );

                    done();
                });
        });

        it("Unauthenticated user shouldn't be able to post a request with a invalid token", (done) => {
            let request = {
                username: "user2",
                email: "user2@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/usermanagement/users")
                .set({ Authorization: `Bearer faketoken` })
                .send(request)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql(
                        "Unauthorized: Invalid token."
                    );

                    done();
                });
        });
    });

    describe("Endpoints should reject user when not authorized", () => {
        var userToken;

        before(function (done) {
            chai.request(server)
                .post("/auth/login")
                .send({
                    email: "test2@test.com",
                    password: "test2",
                })
                .end((err, res) => {
                    userToken = res.body.token;

                    done();
                });
        });
        it("Non-admins shouldn't be able to create a User", (done) => {
            let request = {
                username: "user2",
                email: "user2@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Admin",
            };
            console.log("USER1: ", userToken);

            chai.request(server)
                .post("/usermanagement/users")
                .set({ Authorization: `Bearer ${userToken}` })
                .send(request)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql(
                            "Unauthorized: You not do have permission to view this page."
                        );

                    done();
                });
        });
    });

    describe("DELETE /usermanagement/users/", () => {
        it("it should delete all Users", (done) => {
            chai.request(server)
                .delete("/usermanagement/users/")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/usermanagement/users/")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
