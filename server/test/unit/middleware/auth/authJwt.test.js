let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const authJwt = require("../../../../middleware/auth/authJwt");

chai.use(chaiAsPromised);

afterEach(function () {
    sinon.restore();
});

describe("Testing AuthJwt", () => {
    it("isAdmin: should be successful", (done) => {
        let res = {
            send: function () {},
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();

        authJwt.isAdmin({ role: "Admin" }, res, next);

        expect(next.calledOnce).to.be.true;

        done();
    });

    it("isAdmin: shouldn't be successful", (done) => {
        let res = {
            send: function (response) {
                expect(response.message).to.be.equal(
                    "Unauthorized: You not do have permission to view this page."
                );
            },
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();

        authJwt.isAdmin({ role: "User" }, res, next);

        expect(next.calledOnce).to.be.false;

        done();
    });

    it("isEmployee: should be successful", (done) => {
        let res = {
            send: function () {},
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();

        authJwt.isEmployee({ role: "Employee" }, res, next);

        expect(next.calledOnce).to.be.true;

        done();
    });

    it("isEmployee: shouldn't be successful", (done) => {
        let res = {
            send: function (response) {
                expect(response.message).to.be.equal(
                    "Unauthorized: You not do have permission to view this page."
                );
            },
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();

        authJwt.isEmployee({ role: "User" }, res, next);

        expect(next.calledOnce).to.be.false;

        done();
    });

    it("CheckToken: shouldn't be successful", (done) => {
        let res = {
            send: function (response) {
                expect(response.message).to.be.equal(
                    "Unauthorized: No token provided."
                );
            },
            status: function () {
                return this;
            },
        };
        let next = sinon.stub();

        authJwt.checkJwtToken({}, res, next);

        expect(next.calledOnce).to.be.false;

        done();
    });
});
