let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");

const model = require("../../../database").getModel("notification");

chai.use(chaiAsPromised);

afterEach(function () {
    sinon.restore();
});

describe("Testing Notification modal validation", () => {
    it("Notification model validation", (done) => {
        var m = new model();

        m.validate(function (err) {
            expect(err.errors).to.exist;
            expect(err.errors.username);
            expect(err.errors.message);
            done();
        });
    });
});
