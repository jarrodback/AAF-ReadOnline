let chai = require("chai");
let chaiHttp = require("chai-http");
const { before } = require("mocha");
let server = require("../../../app").app;
let should = chai.should();
chai.use(chaiHttp);

const request1 = "123456789121";
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

describe("Testing the /api/v1/requests path", () => {
    describe("POST /api/v1/requests", () => {
        it("it should not create a Request without all required fields", (done) => {
            let request = {
                name: "My Book",
                datePublished: Date.now(),
                cost: 40,
                author: "My Author",
                type: "Invalid",
                requestingUser: "987654321121",
            };

            chai.request(server)
                .post("/api/v1/requests")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Request data is invalid.");

                    done();
                });
        });

        it("it should create a Request", (done) => {
            let request = {
                name: "My Book",
                cost: 40,
                author: "My Author",
                type: "Book",
                requestingUser: "jarrodback",
            };
            123456789122;
            chai.request(server)
                .post("/api/v1/requests")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(request)
                .end((err, res) => {
                    setTimeout(function () {
                        res.should.have.status(200);
                        res.body.should.have
                            .property("message")
                            .eql("Request was successfully created.");

                        done();
                    }, 100);
                });
        });
    });

    describe("GET /api/v1", () => {
        it("it should return a welcome message", (done) => {
            chai.request(server)
                .get("/api/v1")
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

    describe("GET /api/v1/requests", () => {
        it("it should get all the Requests", (done) => {
            chai.request(server)
                .get("/api/v1/requests")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a("array");
                    res.body.data.length.should.be.eql(10);

                    done();
                });
        });

        it("it should return empty if no record was found", (done) => {
            chai.request(server)
                .get("/api/v1/requests/" + fakeId)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    // res.body.should.have.a
                    //     .property("message")
                    //     .eql("Could not find record.");

                    done();
                });
        });

        it("it should return 404 if Request Id was invalid", (done) => {
            chai.request(server)
                .get("/api/v1/requests/" + invalidId)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Request ID is invalid.");

                    done();
                });
        });

        it("it should GET the Request", (done) => {
            chai.request(server)
                .get("/api/v1/requests/" + request1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("_id");
                    res.body.should.have.property("name").eql("My Book");
                    res.body.should.have.property("cost");
                    res.body.should.have.property("type");
                    res.body.should.have.property("status");
                    res.body.should.have.property("requestingUser");

                    done();
                });
        });
    });

    describe("UPDATE /api/v1/requests/" + request1, () => {
        it("it should update a Request", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/api/v1/requests/" + request1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Request was successfully updated.");
                });

            chai.request(server)
                .get("/api/v1/requests/" + request1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    setTimeout(function () {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have
                            .property("name")
                            .eql("My new named Book");

                        done();
                    }, 100);
                });
        });

        it("if the Request to update isn't found it should return 404", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/api/v1/requests/" + fakeId)
                .set("Cookie", cookie + ";  " + cookieSig)
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

    describe("UPDATE /api/v1/requests invalid", () => {
        let cookieUser;
        let cookieSigUser;
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

        it("shouldn't be able to edit the request if it isnt' theirs", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/api/v1/requests/123456789123")
                .set("Cookie", cookieUser + ";  " + cookieSigUser)
                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.a
                        .property("message")
                        .eql(
                            "You do not have permission to update this request."
                        );

                    done();
                });
        });
    });

    describe("DELETE /api/v1/requests/" + request1, () => {
        it("it should delete a Request", (done) => {
            chai.request(server)
                .delete("/api/v1/requests/" + request1)
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/api/v1/requests")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a("array");
                    res.body.data.length.should.be.eql(9);

                    done();
                });
        });

        it("it should not delete a Request with an invalid id", (done) => {
            chai.request(server)
                .delete("/api/v1/requests/2224")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have
                        .property("message")
                        .eql("Request ID is invalid.");

                    done();
                });
        });

        it("it should delete all Requests", (done) => {
            chai.request(server)
                .delete("/api/v1/requests/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Requests were successfully deleted.");
                });

            chai.request(server)
                .get("/api/v1/requests/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    // No returns
                    done();
                });
        });
    });

    describe("No permission to access /api/v1/requests/" + request1, () => {
        it("it should reject the request", (done) => {
            chai.request(server)
                .get("/api/v1/requests")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
    });
});
