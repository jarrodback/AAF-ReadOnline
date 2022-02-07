let chai = require("chai");
let chaiHttp = require("chai-http");
const { before } = require("mocha");
let server = require("../../../app").app;
let should = chai.should();
chai.use(chaiHttp);

var cookie;
var cookieSig;

before(function (done) {
    chai.request(server)
        .post("/api/v1/login")
        .send({
            email: "test3@test.com",
            password: "test3",
        })
        .end((err, res) => {
            cookie = res.headers["set-cookie"].pop().split(";")[0];
            cookieSig = res.headers["set-cookie"].pop().split(";")[0];

            done();
        });
});

describe("Testing the /config path", () => {
    describe("Testing the employees interaction with /config/ path", () => {
        it("Employees should be able to retrieve config settings", (done) => {
            chai.request(server)
                .get("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a("object");
                    res.body[0].should.have.property("costThreshold");

                    done();
                });
        });

        it("Employees shouldn't be able to set config settings", (done) => {
            chai.request(server)
                .put("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send({ configThreshold: 100 })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have
                        .property("message")
                        .eql(
                            "Unauthorized: You not do have permission to view this page."
                        );

                    done();
                });
        });
    });

    describe("Testing the admins interaction with /api/v1/ path", () => {
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

        it("Admin should be able to set config settings", (done) => {
            chai.request(server)
                .put("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send({ costThreshold: 10000 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have
                        .property("message")
                        .eql("Config was successfully updated.");
                });

            chai.request(server)
                .get("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a("object");
                    res.body[0].should.have
                        .property("costThreshold")
                        .eql(10000);

                    done();
                });
        });
    });

    describe("Testing the users interaction with /api/v1/ path", () => {
        before(function (done) {
            chai.request(server)
                .post("/api/v1/login")
                .send({
                    email: "test2@test.com",
                    password: "test2",
                })
                .end((err, res) => {
                    cookie = res.headers["set-cookie"].pop().split(";")[0];
                    cookieSig = res.headers["set-cookie"].pop().split(";")[0];

                    done();
                });
        });

        it("Users shouldn't be able to retrieve config settings", (done) => {
            chai.request(server)
                .get("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have
                        .property("message")
                        .eql(
                            "Unauthorized: You not do have permission to view this page."
                        );

                    done();
                });
        });

        it("Users shouldn't be able to set config settings", (done) => {
            chai.request(server)
                .put("/api/v1/config")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send({ configThreshold: 100 })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have
                        .property("message")
                        .eql(
                            "Unauthorized: You not do have permission to view this page."
                        );

                    done();
                });
        });
    });
});
