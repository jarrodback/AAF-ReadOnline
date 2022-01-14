let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const RequestService = require("../../../services/RequestService");

chai.use(chaiAsPromised);

const userId = "987654321122";
const requestId = "123456789122";

describe("Testing Request Service", () => {
    const request = {
        name: "Name",
        datePublished: Date.now(),
        cost: 5,
        author: "Author",
        type: "Book",
        requestingUser: userId,
    };

    it("createRequest: should be successfully", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.create = sinon.stub();
        requestService.createRequest(request);

        expect(requestService.mongooseService.create.calledOnce).to.be.true;

        done();
    });

    it("createEquest: shouldn't be successful because of invalid request", (done) => {
        const invalidRequest = {};
        const requestService = new RequestService();
        requestService.mongooseService.create = sinon.stub();

        requestService
            .createRequest(invalidRequest)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("Request data is invalid.");
                expect(requestService.mongooseService.create.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("findAllRequests: should be successful", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.findAll = sinon.stub();
        requestService.findAllRequests();

        expect(requestService.mongooseService.findAll.calledOnce).to.be.true;

        done();
    });

    it("findRequest: should be successful", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.findById = sinon.stub();
        requestService.findRequest(requestId);

        expect(requestService.mongooseService.findById.calledOnce).to.be.true;

        done();
    });

    it("findRequest: shouldn't be successful because of invalid Id", (done) => {
        const invalidRequestId = "1234567891221sggs";
        const requestService = new RequestService();
        requestService.mongooseService.findById = sinon.stub();

        requestService
            .findRequest(invalidRequestId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Request ID is invalid.");
                expect(requestService.mongooseService.findById.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("updateRequest: should be successful", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.update = sinon.stub();
        requestService.updateRequest(requestId, { name: "New name" });

        expect(requestService.mongooseService.update.calledOnce).to.be.true;

        done();
    });

    it("updateRequest: shouldn't be successful because of invalid Id", (done) => {
        const invalidRequestId = "1234567891221sggs";
        const requestService = new RequestService();
        requestService.mongooseService.update = sinon.stub();

        requestService
            .updateRequest(invalidRequestId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Request ID is invalid.");
                expect(requestService.mongooseService.update.calledOnce).to.be
                    .false;

                done();
            });
    });

    it("deleteRequest: should be successful", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.deleteById = sinon.stub();
        requestService.deleteRequest(requestId);

        expect(requestService.mongooseService.deleteById.calledOnce).to.be.true;

        done();
    });

    it("deleteRequest: shouldn't be successful because of invalid Id", (done) => {
        const invalidRequestId = "1234567891221sggs";
        const requestService = new RequestService();
        requestService.mongooseService.deleteById = sinon.stub();

        requestService
            .deleteRequest(invalidRequestId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Request ID is invalid.");
                expect(requestService.mongooseService.deleteById.calledOnce).to
                    .be.false;

                done();
            });
    });

    it("deleteAllRequests: should be successful", (done) => {
        const requestService = new RequestService();
        requestService.mongooseService.deleteAll = sinon.stub();
        requestService.deleteAllRequests();

        expect(requestService.mongooseService.deleteAll.calledOnce).to.be.true;

        done();
    });
});
