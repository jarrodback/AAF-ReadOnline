import RequestTable from "../../components/User/ViewRequests.vue";
import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";

describe("Request Table", () => {
    let component;

    beforeEach(() => {
        wrapper = shallowMount(RequestTable);
    });

    it("should render the correct UI on mount", () => {
        expect(wrapper.findAll("h1").length).toEqual(1);
        expect(wrapper.findAll("h1").at(0).text()).toMatch("My Requests");
    });
});
