let chai = require("chai");
let chaiHttp = require("chai-http");
const { before } = require("mocha");
let server = require("../../../app");
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
            email: "test2@test.com",
            password: "test2",
        })
        .end((err, res) => {
            cookie = res.headers["set-cookie"].pop().split(";")[0];
            cookieSig = res.headers["set-cookie"].pop().split(";")[0];

            done();
        });
});

describe("Testing the /api/v1/notifications/ path", () => {
    describe("Users interactions with notifications", () => {
        it("can create notifications", (done) => {
            const notification = {
                message: "you have a notification",
                username: "usER1",
            };
            chai.request(server)
                .post("/api/v1/notifications/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(notification)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have
                        .property("message")
                        .eql("Notification was successfully created.");

                    done();
                });
        });

        it("Users should be able to retrieve all notifications for themselves", (done) => {
            chai.request(server)
                .get("/api/v1/notifications/?username=usER1")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it("Users should be able to delete notifications for themselves", (done) => {
            chai.request(server)
                .delete("/api/v1/notifications/555555555555")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it("Users shouldn't be able to delete notifications that aren't theirs", (done) => {
            chai.request(server)
                .delete("/api/v1/notifications/655555555555")
                .set("Cookie", cookie + ";  " + cookieSig)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql(
                            "You do not have permission to delete this notification."
                        );

                    done();
                });
        });

        it("Users shouldn't be able to create notification without message", (done) => {
            const notification = {
                username: "usER1",
            };
            chai.request(server)
                .post("/api/v1/notifications/")
                .set("Cookie", cookie + ";  " + cookieSig)
                .send(notification)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.should.be.a("object");
                    res.body.should.have
                        .property("message")
                        .eql("Notification data is invalid.");

                    done();
                });
        });
    });
});
