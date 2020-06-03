//  context: add group
describe("addGroup", () => {
    beforeEach(() => {

        cy.visit("http://localhost:8080");
    });
    //test validate group addition form
    it("Validate group addition form", () => {
        //find the field for group name , check if it exists
        cy.get("#inputGroupsName").should("exist");

        //find the submit button , check if it exists
        cy.get("#submit").should("exist");

    });

    //test succesful groud addition.
    it("Successful group addition", () => {
        //start a fake server
        cy.server();

        cy.route("POST", "/group").as("addGroup");

        cy.get("#inputGroupsName").type("Boksen");

        cy.get("#submit").click();

        cy.wait("@addGroup");

        cy.get(".error").should("exist").should("contain", "ERROR");



    })

})