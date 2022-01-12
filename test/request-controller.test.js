let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

const request1 = "123456789121";

describe("Testing the /readonline/requests path", () => {
    describe("POST /readonline/requests", () => {
        it("it should not POST a Request without name field", (done) => {
            let request = {};
            chai.request(server)
                .post("/readonline/requests")
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Invalid Request data.");

                    done();
                });
        });

        it("it should not POST a Request without a valid Type", (done) => {
            let request = {
                _id: "myTestId",
                name: "My Book111111111111",
                datePublished: new Date(),
                cost: 40,
                author: "My Author",
                type: "Invalid",
                requestingUser: "61dd56a297402ee89224efb2",
            };
            chai.request(server)
                .post("/readonline/requests")
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Invalid Request data.");

                    done();
                });
        });

        it("it should POST a Request", (done) => {
            let request = {
                _id: "myTestId",
                name: "My Book111111111111",
                datePublished: new Date(),
                cost: 40,
                author: "My Author",
                type: "Book",
                requestingUser: "61dd56a297402ee89224efb2",
            };
            chai.request(server)
                .post("/readonline/requests")
                .send(request)
                .end((err, res) => {
                    console.log(res);
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("_id");
                    res.body.should.have.property("name");
                    res.body.should.have.property("datePublished");
                    res.body.should.have.property("cost");
                    res.body.should.have.property("type");
                    res.body.should.have.property("requestingUser");

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
                    res.body.length.should.not.be.eql(0);

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
    });

    describe("DELETE /readonline/requests/" + request1, () => {
        it("it should delete a Request", (done) => {
            chai.request(server)
                .delete("/readonline/requests/" + request1)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("DELETE /readonline/requests/", () => {
        it("it should delete all Requests", (done) => {
            chai.request(server)
                .delete("/readonline/requests/")
                .end((err, res) => {
                    res.should.have.status(200);
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
