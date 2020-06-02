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

    // //Test: Check username
    // it("Check username", () => {
    //     cy.get(".register-form button").click();
    //
    // });

    //Test: Successful registration
    it("Successful registration", () => {
        // Start a fake server
        cy.server();
        // Add a stub with the URL /user/register as a POST
        // Respond with a JSON-object when requested
        // Give the stub the alias: @register
        // cy.route("POST", "/user/register", {"username": "test"}).as("login");
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

        //The @register-stub is called, check the contents of the incoming request.
        // cy.get("@register").should((xhr) => {
        //     //The username should match what we typed earlier
        //     expect(xhr.request.body.username).equals("testUser");
        //     //The emailaddress should match what we typed earlier
        //     expect(xhr.request.body.emailaddress).equals("testUser@email.com");
        //     //The password should match what we typed earlier
        //     expect(xhr.request.body.password).equals("testPass123!");
        //     //The password confirmation should match what we typed earlier
        //     expect(xhr.request.body.confirmPassword).equals("testPass123!");
        // });
        // After a successful registration, the URL should now contain #welcome.
        // cy.url().should("contain", "#welcome");
    });

    // // Test: Failed register
    // it("Failed register", ()=>{
    //     // Start a fake server
    //     cy.server();
    //     // Add a stub with the URL /user/login as a POST
    //     // Respond with a JSON-object when requested and set the status-code tot 401.
    //     // Give the stub the alias: @login
    //     cy.route({
    //         method: "POST",
    //         url: "/user/login",
    //         response: {
    //             reason: "ERROR"
    //         },
    //         status: 401
    //     }).as("login");
    //     //Find the field for the username and type the text "testUser".
    //     cy.get("#inputUsername").type("testUser");
    //     //Find the field for the emailaddress and type the text "testUser@email.com".
    //     cy.get("#inputEmailaddress").type("testUser@email.com");
    //     //Find the field for the password and type the text "testPass123!".
    //     cy.get("#inputPassword").type("testPass123!");
    //     //Find the field for the password confirmation and type the text "testPass123".
    //     cy.get("#inputConfirmPassword").type("testPass123!");
    //     //Find the button to register and click it.
    //     cy.get(".register-form button").click();
    //     //Wait for the @register-stub to be called by the click-event.
    //     cy.wait("@register");
    //     //After a failed login, an element containing our error-message should be shown.
    //     cy.get(".error").should("exist").should("contain", "ERROR");
    // });
});