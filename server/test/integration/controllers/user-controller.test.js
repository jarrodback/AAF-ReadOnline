let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../app");
let should = chai.should();

chai.use(chaiHttp);

const user1 = "987654321121";
const fakeId = "111111111111";
const invalidId = "a";

var cookie;
var cookieSig;

before(function (done) {
    chai.request(server)
        .post("/api/v1/login")
        .send({
            email: "test@test.com",
            password: "test1",
        })
        .end((err, res) => {
            cookie = res.headers["set-cookie"].pop().split(";")[0];
            cookieSig = res.headers["set-cookie"].pop().split(";")[0];

            done();
        });
});

describe("Testing the /api/v1/users path", () => {
    describe("POST /api/v1/users", () => {
        it("it should not create a User without all required fields", (done) => {
            let request = {};
            chai.request(server)
                .post("/api/v1/users")
                .set("Cookie", cookie + ";  " + cookieSig)
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
                .post("/api/v1/users")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(request)
                .end((err, res) => {
                    // res.should.have.status(404);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql("Username must be at least 5 letters.");

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
                .post("/api/v1/users")
                .set("Cookie", cookie + ";  " + cookieSig)
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

    describe("GET /api/v1", () => {
        it("it should return a welcome message", (done) => {
            chai.request(server)
                .get("/api/v1")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql("Welcome to the ReadOnline API.");

                    done();
                });
        });
    });

    describe("GET /api/v1/users", () => {
        it("it should get all the Users", (done) => {
            chai.request(server)
                .get("/api/v1/users")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(8);

                    done();
                });
        });

        it("it should return 200 if no User was found", (done) => {
            chai.request(server)
                .get("/api/v1/users/" + fakeId)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it("it should return 404 if User Id was invalid", (done) => {
            chai.request(server)
                .get("/api/v1/users/" + invalidId)
                .set("Cookie", cookie + ";  " + cookieSig)
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
                .get("/api/v1/users/" + user1)
                .set("Cookie", cookie + ";  " + cookieSig)
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

    describe("UPDATE /api/v1/users/" + user1, () => {
        it("it should update a User", (done) => {
            let to_update = {
                username: "backjarrod",
            };
            chai.request(server)
                .put("/api/v1/users/" + user1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/api/v1/users/" + user1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("object");
                    res.body.should.have.property("username").eql("backjarrod");

                    done();
                });
        });

        it("if the User to update isn't found it should return 400", (done) => {
            let to_update = {
                username: "bob12",
            };
            chai.request(server)
                .put("/api/v1/users/" + fakeId)
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("User does not exist.");

                    done();
                });
        });
    });

    describe("DELETE /api/v1/users/" + user1, () => {
        it("it should delete a User", (done) => {
            chai.request(server)
                .delete("/api/v1/users/" + user1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    it("it should not delete a User with an invalid id", (done) => {
        chai.request(server)
            .delete("/api/v1/users/" + fakeId)
            .set("Cookie", cookie + "; " + cookieSig)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have
                    .property("message")
                    .eql("User does not exist.");

                done();
            });
    });

    describe("Endpoints should reject user when not authenticated", () => {
        it("Unauthenticated user shouldn't be able to view requests", (done) => {
            chai.request(server)
                .get("/api/v1/users/")
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
                .post("/api/v1/users")
                .set("Cookie", "goiegjei")
                .send(request)
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
    });

    describe("Endpoints should reject user when not authorized", () => {
        var cookieUser;
        var cookieSigUser;

        before(function (done) {
            chai.request(server)
                .post("/api/v1/login")
                .send({
                    email: "test2@test.com",
                    password: "test2",
                })
                .end((err, res) => {
                    cookieUser = res.headers["set-cookie"].pop().split(";")[0];
                    cookieSigUser = res.headers["set-cookie"]
                        .pop()
                        .split(";")[0];

                    done();
                });
        });
        it("Non-admins shouldn't be able to create a User", (done) => {
            let request = {
                username: "user20",
                email: "user20@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Employee",
            };

            chai.request(server)
                .post("/api/v1/users")
                .set("Cookie", cookieUser + ";  " + cookieSigUser)
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

        it("Non-admins shouldn't be able to update a User's rights", (done) => {
            let request = {
                username: "user20",
                email: "user20@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Employee",
                rights: ["authorise"],
            };

            chai.request(server)
                .put("/api/v1/users/" + user1)
                .set("Cookie", cookieUser + ";  " + cookieSigUser)
                .send(request)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql(
                            "You do not have permission to update the user's rights."
                        );

                    done();
                });
        });
    });

    describe("DELETE /api/v1/users/", () => {
        it("it should delete all Users", (done) => {
            chai.request(server)
                .delete("/api/v1/users/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/api/v1/users/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it("it should create a User", (done) => {
            let request = {
                username: "jarrodback",
                email: "user2@my.shu.ac.uk",
                password: "test",
                requests: [],
                role: "Admin",
            };
            chai.request(server)
                .post("/api/v1/users")
                .set("Cookie", cookie + ";  " + cookieSig)
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
});
