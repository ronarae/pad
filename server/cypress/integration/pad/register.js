//Context: Registration
describe("Registration", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#register");
    });

    //Test: Visit registration via navbar
    it("Visit registration via navbar", () => {
        //Open register page via navbar
        cy.get('.navbar-nav').contains('Registreren').click()
    });

    //Test: Validate registration form
    it("Validate registration form", () => {
        //Find the field for the username, check if it exists.
        cy.get("#inputUsername").should("exist");
        //Find the field for the emailaddress, check if it exists.
        cy.get("#inputEmailaddress").should("exist");
        //Find the field for the password, check if it exists.
        cy.get("#inputPassword").should("exist");
        //Find the field for the password confirmation, check if it exists.
        cy.get("#inputConfirmPassword").should("exist");
        //Find the button to register, check if it exists.
        cy.get(".login-form button").should("exist");
    });

    //Test: Successful registration
    it("Successful registration", () => {
        // Start a fake server
        cy.server();
        // Add a stub with the URL /user/register as a POST
        // Respond with a JSON-object when requested
        // Give the stub the alias: @register
        //Find the field for the username and type the text "testUser".
        cy.get("#inputUsername").type("testUser");
        //Find the field for the emailaddress and type the text "testUser@email.com".
        cy.get("#inputEmailaddress").type("testUser@email.com");
        //Find the field for the password and type the text "testPass123!".
        cy.get("#inputPassword").type("testPass123!");
        //Find the field for the password confirmation and type the text "testPass123".
        cy.get("#inputConfirmPassword").type("testPass123!");
        //Find the button to register and click it.
        cy.get(".login-form button").click();
        //Wait for the @register-stub to be called by the click-event.
        // cy.wait("@register");
        cy.url().should("contain", "#welcome");
    });
});