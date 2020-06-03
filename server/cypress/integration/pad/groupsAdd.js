//  context: add group. @author Yazan Mousa
describe("addGroup", () => {
    beforeEach(() => {
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#group");
    });
    //test validate group addition form
    it("Validate group addition form", () => {
        //find the field for group name , check if it exists
        cy.get("#inputGroupsName").should("exist");

        //find the submit button , check if it exists
        cy.get("#groupSubmit").should("exist");

    });

    //test succesful groud addition.
    it("Successful group addition", () => {
        //start a fake server
        cy.server();

        cy.route("POST", "/group").as("addGroup");

        cy.get("#inputGroupsName").type("Boksen");

        cy.get("#groupSubmit").click();

        cy.wait("@addGroup");

        cy.url().should("contain", "#welcome");

        //cy.get(".error").should("exist").should("contain", "ERROR");



    })

})