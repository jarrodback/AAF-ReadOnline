let chai = require("chai");
let chaiHttp = require("chai-http");
const { before } = require("mocha");
let server = require("../../../app");
let should = chai.should();
const { checkJwtToken } = require("../../../auth/authJwt");
chai.use(chaiHttp);

const request1 = "123456789121";
const fakeId = "111111111111";
const invalidId = "a";

// var token;
var Cookies;
before(function (done) {
    chai.request(server)
        .post("/auth/login")
        //.set({ Authorization: `Bearer ${token}` })
        .send({
            email: "test@test.com",
            password: "test1",
        })
        .end((err, res) => {
            // token = res.body.token;
            console.log("Loggined in: ", res.body.message);
            Cookies = res.headers["set-cookie"].pop().split(";")[0];
            console.log("coo1kies: ", Cookies);
            done();
        });
});

describe("Testing the /readonline/requests path", () => {
    describe("POST /readonline/requests", () => {
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
                .post("/readonline/requests")
                .set("Cookie", Cookies)

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
                requestingUser: "987654321121",
            };
            chai.request(server)
                .post("/readonline/requests")
                //                .set({ Authorization: `Bearer ${token}` })

                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have
                        .property("message")
                        .eql("Request was successfully created.");

                    done();
                });
        });
    });

    describe("GET /readonline", () => {
        it("it should return a welcome message", (done) => {
            chai.request(server)
                .get("/readonline")
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

    describe("GET /readonline/requests", () => {
        it("it should get all the Requests", (done) => {
            chai.request(server)
                .get("/readonline/requests")
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(3);

                    done();
                });
        });

        it("it should return 404 if no record was found", (done) => {
            chai.request(server)
                .get("/readonline/requests/" + fakeId)
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Could not find record.");

                    done();
                });
        });

        it("it should return 404 if Request Id was invalid", (done) => {
            chai.request(server)
                .get("/readonline/requests/" + invalidId)
                //                .set({ Authorization: `Bearer ${token}` })

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
                .get("/readonline/requests/" + request1)
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("_id");
                    res.body.should.have.property("name").eql("My Book");
                    res.body.should.have.property("datePublished");
                    res.body.should.have.property("cost");
                    res.body.should.have.property("type");
                    res.body.should.have.property("requestingUser");

                    done();
                });
        });
    });

    describe("UPDATE /readonline/requests/" + request1, () => {
        it("it should update a Request", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/readonline/requests/" + request1)
                //                .set({ Authorization: `Bearer ${token}` })

                .send(to_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Request was successfully updated.");

                    done();
                });

            chai.request(server)
                .get("/readonline/requests/" + request1)
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("name")
                        .eql("My new named Book");
                });
        });

        it("if the Request to update isn't found it should return 404", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/readonline/requests/" + fakeId)
                //                .set({ Authorization: `Bearer ${token}` })

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

    describe("DELETE /readonline/requests/" + request1, () => {
        it("it should delete a Request", (done) => {
            chai.request(server)
                .delete("/readonline/requests/" + request1)
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/readonline/requests")
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(2);

                    done();
                });
        });

        it("it should not delete a Request with an invalid id", (done) => {
            chai.request(server)
                .delete("/readonline/requests/" + fakeId)
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have
                        .property("message")
                        .eql("Could not find record.");

                    done();
                });
        });

        it("it should delete all Requests", (done) => {
            chai.request(server)
                .delete("/readonline/requests/")
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Requests were successfully deleted.");

                    done();
                });

            chai.request(server)
                .get("/readonline/requests/")
                //                .set({ Authorization: `Bearer ${token}` })

                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                });
        });
    });
});
