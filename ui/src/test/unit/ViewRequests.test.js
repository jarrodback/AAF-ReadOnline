const RequestTable = require("../../components/User/ViewRequests.vue");
const { mount } = require("@vue/test-utils");
const { expect } = require("chai");
//         expect(wrapper.findAll("h1").at(0).text()).toMatch("My R1equests");

describe("Mounted App", () => {
    const wrapper = mount(RequestTable, {
        createRequest: function () {},
        editRequest: function () {},
        showChat: function () {},
    });
    it("does a wrapper exist", () => {
        expect(wrapper.exists()).to.be.eql(true);
    });

    it("Is the title correct", () => {
        console.log(wrapper);
        expect(wrapper.findAll("div").length).to.be.eql(1);
    });
});
