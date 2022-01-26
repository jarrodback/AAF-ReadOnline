let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");

const model = require("../../../database").getModel("user");

chai.use(chaiAsPromised);

afterEach(function () {
    sinon.restore();
});

describe("Testing User modal validation", () => {
    it("User model validation", (done) => {
        var m = new model();

        m.validate(function (err) {
            expect(err.errors).to.exist;
            expect(err.errors.username);
            expect(err.errors.email);
            expect(err.errors.password);
            expect(err.errors.role);
            done();
        });
    });

    it("should check for instance method calling", () => {
        model.update = sinon.stub();

        var m = new model({
            username: "test3",
            email: "email",
            role: "User",
            password: "test",
        });

        m.removeRequest(1, 1, function () {});

        expect(model.update.calledOnce).to.be.true;
    });
});
