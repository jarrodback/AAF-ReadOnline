let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../app");
let should = chai.should();

chai.use(chaiHttp);

const user1 = "987654321121";
const fakeId = "111111111111";
const invalidId = "a";

describe("Testing the /usermanagement/users path", () => {
    describe("POST /usermanagement/users", () => {
        it("it should not create a User without all required fields", (done) => {
            let request = {};
            chai.request(server)
                .post("/usermanagement/users")
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
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/usermanagement/users")
                .send(request)
                .end((err, res) => {
                    res.should.have.status(404);
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
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/usermanagement/users")
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(3);

                    done();
                });
        });

        it("it should return 404 if no User was found", (done) => {
            chai.request(server)
                .get("/usermanagement/users/" + fakeId)
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
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/usermanagement/users/" + user1)
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
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    it("it should not delete a User with an invalid id", (done) => {
        chai.request(server)
            .delete("/usermanagement/users/" + fakeId)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have
                    .property("message")
                    .eql("Could not find record.");

                done();
            });
    });

    describe("DELETE /usermanagement/users/", () => {
        it("it should delete all Users", (done) => {
            chai.request(server)
                .delete("/usermanagement/users/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });

            chai.request(server)
                .get("/usermanagement/users/")
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                });
        });
    });
});
