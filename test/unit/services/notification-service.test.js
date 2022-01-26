let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let expect = chai.expect;
const sinon = require("sinon");
const NotificationService = require("../../../services/NotificationService");

chai.use(chaiAsPromised);

const userId = "987654321122";
const notificationId = "655555555555";

afterEach(function () {
    sinon.restore();
});

describe("Testing Notification Service", () => {
    const notification = {
        username: "jarrodback",
        message: "test",
    };

    it("createNotification: should be successful", (done) => {
        const notificationService = new NotificationService();

        notificationService.mongooseService.create = sinon.stub();
        notificationService.createNotification(notification);

        setTimeout(function () {
            expect(
                notificationService.mongooseService.create.calledOnce
            ).to.be.true;

            done();
        }, 100);
    });

    it("createNotification: shouldn't be successful because of invalid notification", (done) => {
        const invalidNotification = {};
        const notificationService = new NotificationService();
        notificationService.mongooseService.create = sinon.stub();

        notificationService
            .createNotification(invalidNotification)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(400);
                expect(error.message).to.equal("Notification data is invalid.");
                expect(notificationService.mongooseService.create.calledOnce).to
                    .be.false;

                done();
            });
    });

    it("findAllNotifications: should be successful", (done) => {
        const notificationService = new NotificationService();
        notificationService.mongooseService.findByProperty = sinon.stub();
        notificationService.findNotificationByParams();

        expect(notificationService.mongooseService.findByProperty.calledOnce).to
            .be.true;

        done();
    });

    it("deleteNotification: should be successful", (done) => {
        const notificationService = new NotificationService();
        notificationService.mongooseService.deleteById = sinon.stub();
        notificationService.deleteNotification(notificationId, {
            username: "user2",
            role: "Admin",
        });

        expect(notificationService.mongooseService.deleteById.calledOnce).to.be
            .false;

        done();
    });

    it("deleteNotification: shouldn't be successful because of invalid Id", (done) => {
        const invalidNotificationId = "1234567891221sggs";
        const notificationService = new NotificationService();
        notificationService.mongooseService.deleteById = sinon.stub();
        notificationService
            .deleteNotification(invalidNotificationId)
            .then(() => {
                expect.fail("Promise should have been rejected.");
            })
            .catch((error) => {
                expect(error.status).to.equal(404);
                expect(error.message).to.equal("Notification ID is invalid.");
                expect(
                    notificationService.mongooseService.deleteById.calledOnce
                ).to.be.false;

                done();
            });
    });
});
