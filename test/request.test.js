let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

let mongoose = require("mongoose");
let Request = require("../models/request.model");

chai.use(chaiHttp);

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
                    res.body.message.should.be.eql("Content can not be empty!");

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
                audiobook: false,
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
                    res.body.should.have.property("audiobook");
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
                    res.body.should.have.property("message");
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
    });

    describe("UPDATE /readonline/requests/61dd94ed3eb9374d3b95ac0d", () => {
        it("it should UPDATE a Request", (done) => {
            let to_update = {
                name: "My new named Book",
            };
            chai.request(server)
                .put("/readonline/requests/61dd94ed3eb9374d3b95ac0d")
                .send(to_update)
                .end((err, res) => {
                    console.log(res);
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
