import store from "../../store";

describe("Test store sets and gets values correctly", () => {
    test("Can set a user on store", () => {
        const user = {
            id: "id",
            username: "username",
            role: "Admin",
        };

        store.commit("setUser", user);

        expect(store.getters.user).toBe(user);
    });

    test("Can set a loggedIn on store", () => {
        const loggedIn = true;

        store.commit("setLoggedIn", loggedIn);

        expect(store.getters.loggedIn).toBe(loggedIn);
    });
});
