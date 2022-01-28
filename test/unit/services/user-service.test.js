let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const UserService = require("../../../services/UserService");

chai.use(chaiAsPromised);

const userId = "987654321122";

describe("Testing User Service", () => {
    const user = {
        username: "username",
        email: "email",
        role: "Admin",
        password: "password",
    };

    it("createUser: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.create = sinon.stub();
        userService.createUser(user);

        expect(userService.mongooseService.create.calledOnce).to.be.true;

        done();
    });

    it("createEquest: shouldn't be successful because of invalid user", (done) => {
        const invalidUser = {};
        const userService = new UserService();
        userService.mongooseService.create = sinon.stub();

        userService
            .createUser(invalidUser)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("User data is invalid.");
                expect(userService.mongooseService.create.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("findAllUsers: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.findAll = sinon.stub();
        userService.findAllUsers();

        expect(userService.mongooseService.findAll.calledOnce).to.be.true;

        done();
    });

    it("findUser: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.findById = sinon.stub();
        userService.findUser(userId);

        expect(userService.mongooseService.findById.calledOnce).to.be.true;

        done();
    });

    it("findUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.mongooseService.findById = sinon.stub();

        userService
            .findUser(invalidUserId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.mongooseService.findById.calledOnce).to.be
                    .false;

                done();
            });
    });
    it("findUserByProperty: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.findByProperty = sinon.stub();
        userService.findUserByProperty("_id", userId);

        expect(userService.mongooseService.findByProperty.calledOnce).to.be
            .true;

        done();
    });

    it("updateUser: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.update = sinon.stub();
        console.log("starting test");
        userService.updateUser(userId, { name: "New name" }, { role: "User" });

        expect(userService.mongooseService.update.calledOnce).to.be.true;

        done();
    });

    it("updateUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.mongooseService.update = sinon.stub();

        userService
            .updateUser(invalidUserId, {}, { role: "User" })
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.mongooseService.update.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("deleteUser: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.deleteById = sinon.stub();
        userService.deleteUser(userId);

        expect(userService.mongooseService.deleteById.calledOnce).to.be.true;

        done();
    });

    it("deleteUser: shouldn't be successful because of invalid Id", (done) => {
        const invalidUserId = "1234567891221sggs";
        const userService = new UserService();
        userService.mongooseService.deleteById = sinon.stub();

        userService
            .deleteUser(invalidUserId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("User ID is invalid.");
                expect(userService.mongooseService.deleteById.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("deleteAllUsers: should be successful", (done) => {
        const userService = new UserService();
        userService.mongooseService.deleteAll = sinon.stub();
        userService.deleteAllUsers();

        expect(userService.mongooseService.deleteAll.calledOnce).to.be.true;

        done();
    });
});
