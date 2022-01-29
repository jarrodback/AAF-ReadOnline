const RequestTable = require("../../components/User/ViewRequests.vue");
const { mount } = require("@vue/test-utils");
const { expect } = require("chai");

test("display h2", () => {
    const wrapper = mount(RequestTable);

    expect(wrapper.findAll("h1").length).toEqual(1);
    expect(wrapper.findAll("h1").at(0).text()).toMatch("My R1equests");
});
