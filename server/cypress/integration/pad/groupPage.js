//Contect visit page




//Setup session
describe("Create Event", () => {//Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        //Go to the specified URL
        cy.visit("http://localhost:8080/grouPage");
    });
});
