let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");

const model = require("../../../database").getModel("request");

chai.use(chaiAsPromised);

afterEach(function () {
    sinon.restore();
});

describe("Testing Request modal validation", () => {
    it("Request model validation", (done) => {
        var m = new model();

        m.validate(function (err) {
            expect(err.errors).to.exist;
            expect(err.errors.name);
            expect(err.errors.cost);
            expect(err.errors.author);
            expect(err.errors.type);
            expect(err.errors.requestingUser);
            expect(err.errors.status);
            done();
        });
    });
});
