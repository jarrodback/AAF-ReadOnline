let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("../app");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

const request1 = "123456789121";
const fakeId = 111111111111;

describe("Testing the /readonline/requests path", () => {
    describe("POST /readonline/requests", () => {
        it("it should not POST a Request without all required fields", (done) => {
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
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql(
                        "Request was unable to be created."
                    );

                    done();
                });
        });

        it("it should POST and create a Request", (done) => {
            let request = {
                name: "My Book",
                cost: 40,
                author: "My Author",
                type: "Book",
                requestingUser: "987654321121",
            };
            chai.request(server)
                .post("/readonline/requests")
                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    // res.body.should.be.a("object");
                    // res.body.should.have.property("_id");
                    // res.body.should.have.property("name");
                    // res.body.should.have.property("cost");
                    // res.body.should.have.property("type");
                    res.body.should.have.property("message");

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
        it("should GET all the Requests", (done) => {
            chai.request(server)
                .get("/readonline/requests")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(3);

                    done();
                });
        });

        it("should return 404 if no record was found", (done) => {
            chai.request(server)
                .get("/readonline/requests/" + fakeId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.a
                        .property("message")
                        .eql("Request could not be found.");

                    done();
                });
        });

        it("should GET the Request", (done) => {
            chai.request(server)
                .get("/readonline/requests/" + request1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body[0].should.be.a("object");
                    res.body[0].should.have.property("_id");
                    res.body[0].should.have.property("name").eql("My Book");
                    res.body[0].should.have.property("datePublished");
                    res.body[0].should.have.property("cost");
                    res.body[0].should.have.property("type");
                    res.body[0].should.have.property("requestingUser");

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
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body[0].should.be.a("object");
                    res.body[0].should.have
                        .property("name")
                        .eql("My new named Book");
                });
        });

        // it("failure to UPDATE should return a 404", (done) => {
        //     let to_update = {
        //         name: "My new named Book",
        //     };
        //     chai.request(server)
        //         .put("/readonline/requests/" + fakeId)
        //         .send(to_update)
        //         .end((err, res) => {
        //             res.should.have.status(404);
        //             res.body.should.have.a
        //                 .property("message")
        //                 .eql("Request to update could not be found.");

        //             done();
        //         });

        //     chai.request(server)
        //         .get("/readonline/requests/" + request1)
        //         .end((err, res) => {
        //             res.should.have.status(200);

        //             res.body[0].should.be.a("object");
        //             res.body[0].should.have
        //                 .property("name")
        //                 .eql("My new named Book");
        //         });
        // });
    });

    describe("DELETE /readonline/requests/" + request1, () => {
        it("it should delete a Request", (done) => {
            chai.request(server)
                .delete("/readonline/requests/" + request1)
                .end((err, res) => {
                    res.should.have.status(200);
                });

            chai.request(server)
                .get("/readonline/requests")
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
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have
                        .property("message")
                        .eql("Request to be deleted could not be found.");

                    done();
                });
        });

        it("it should delete all Requests", (done) => {
            chai.request(server)
                .delete("/readonline/requests/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a
                        .property("message")
                        .eql("Requests were successfully deleted.");

                    done();
                });

            chai.request(server)
                .get("/readonline/requests/")
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                });
        });
    });
});
