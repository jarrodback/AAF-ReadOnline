let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

const user1 = "987654321121";

describe("Testing the /usermanagement/users path", () => {
    describe("POST /usermanagement/users", () => {
        it("it should not create a User without username field", (done) => {
            let request = {};
            chai.request(server)
                .post("/usermanagement/users")
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Content can not be empty.");

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
                    res.body.should.have.property("_id");
                    res.body.should.have.property("username").eql("user2");
                    res.body.should.have.property("email");
                    res.body.should.have.property("requests");
                    res.body.should.have.property("dateCreated");
                    res.body.should.have.property("role");

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
        it("it should GET all the Users", (done) => {
            chai.request(server)
                .get("/usermanagement/users")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.not.be.eql(0);

                    done();
                });
        });

        it("it should GET the User", (done) => {
            chai.request(server)
                .get("/usermanagement/users/" + user1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].should.be.a("object");
                    res.body[0].should.have.property("_id");
                    res.body[0].should.have
                        .property("username")
                        .eql("jarrodback");
                    res.body[0].should.have.property("email");
                    res.body[0].should.have.property("requests");
                    res.body[0].should.have.property("dateCreated");
                    res.body[0].should.have.property("role");

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
                    done();
                });

            chai.request(server)
                .get("/usermanagement/users/" + user1)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body[0].should.be.a("object");
                    res.body[0].should.have
                        .property("username")
                        .eql("backjarrod");
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
