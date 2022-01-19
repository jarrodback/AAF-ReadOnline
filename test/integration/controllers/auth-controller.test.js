let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../app");
let should = chai.should();
chai.use(chaiHttp);

describe("Testing /auth paths", () => {
    it("user should be able to login", (done) => {
        chai.request(server)
            .post("/auth/login")
            .send({
                email: "test@test.com",
                password: "test1",
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql("Successfully logged in.");
                res.should.have.cookie("readonline-token");

                done();
            });
    });

    it("user shouldn't be able to login with invalid credentials", (done) => {
        chai.request(server)
            .post("/auth/login")
            .send({
                email: "test@test.com",
                password: "test2",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql(
                    "Your email or password is incorrect."
                );

                done();
            });
    });

    it("user should be able to register", (done) => {
        chai.request(server)
            .post("/auth/register")
            .send({
                email: "test5@test.com",
                password: "test1",
                username: "username10",
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql(
                    "User was successfully created."
                );

                done();
            });
    });

    it("user shouldn't be able to register with duplicate email", (done) => {
        chai.request(server)
            .post("/auth/register")
            .send({
                email: "test5@test.com",
                password: "test1",
                username: "username11",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql("Email is already in use.");

                done();
            });
    });

    it("user shouldn't be able to register with duplicate username", (done) => {
        chai.request(server)
            .post("/auth/register")
            .send({
                email: "test6@test.com",
                password: "test1",
                username: "username10",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.eql("Username is already in use.");

                done();
            });
    });
});
