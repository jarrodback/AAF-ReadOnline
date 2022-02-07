import { filterList, filterUserList } from "../../helpers/helpers";
const { expect } = require("chai");

describe("Requests are filtered", () => {
    it("Filter requests list by name", () => {
        const requests = [
            { name: "A", status: "Pending Review" },
            { name: "B", status: "Approved" },
        ];

        const filteredRequests = filterList("B", requests);

        expect(filteredRequests.length == 1);
        expect(filteredRequests[0].name == "B");
    });

    it("Filter requests list by status", () => {
        const requests = [
            { name: "A", status: "Pending Review" },
            { name: "B", status: "Approved" },
        ];

        const filteredRequests = filterList("Approved", requests);

        expect(filteredRequests.length == 1);
        expect(filteredRequests[0].status == "Approved");
    });
});

describe("Users are filtered", () => {
    it("Filter users list by name", () => {
        const users = [
            { username: "A", role: "User" },
            { username: "B", role: "Admin" },
        ];

        const filteredUsers = filterUserList("B", users);

        expect(filteredUsers.length == 1);
        expect(filteredUsers[0].username == "B");
    });

    it("Filter requests list by role", () => {
        const users = [
            { username: "A", role: "User" },
            { username: "B", role: "Admin" },
        ];

        const filteredUsers = filterUserList("User", users);

        expect(filteredUsers.length == 1);
        expect(filteredUsers[0].role == "User");
    });
});
