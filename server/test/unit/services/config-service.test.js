let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const ConfigService = require("../../../services/ConfigService");

chai.use(chaiAsPromised);

afterEach(function () {
    sinon.restore();
});

describe("Testing Config Service", () => {
    const config = {
        costThreshold: 100000,
    };

    it("updateConfig: should be successful", (done) => {
        const configService = new ConfigService();

        configService.mongooseService.update = sinon.stub();
        configService.updateConfig(config);

        expect(configService.mongooseService.update.calledOnce).to.be.true;
        done();
    });

    it("updateConfig: shouldn't be successful because of invalid config", (done) => {
        const configService = new ConfigService();
        configService.mongooseService.update = sinon.stub();

        configService.updateConfig();

        expect(configService.mongooseService.update.calledOnce).to.be.false;

        done();
    });

    it("findAllConfigs: should be successful", (done) => {
        const configService = new ConfigService();
        configService.mongooseService.findAll = sinon.stub();
        configService.findAllSettings();

        expect(configService.mongooseService.findAll.calledOnce).to.be.true;

        done();
    });
});
