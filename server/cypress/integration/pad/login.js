//Context: Login

describe("Login", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080");
    });

    //TesT: validate login form
    it('Validate login form', () => {
        cy.get('#inputPassword').should("exist");

        //Find the field for the password, check if it exist
        cy.get('#inputPassword').should("exist");

        //find the button to login, check if it exist.
        cy.get('.btn-primary').should("exist");


    });


    //Test: Succesful login

    it("Successful login", () => {
        debugger;
        //Start a fake server
        cy.server();

        //Add a stub with the url /user/login as a POST
        //Respond with a JSON-object when requested
        //Give the stub the alias: @login
        cy.route("POST", "/user/login", {"username": "test"}).as("login");

        //Find the field for the username and type the text "test"
        cy.get('#inputUsername').type("test");

        //Find the field for the password and type the text "test"
        cy.get('#inputPassword').type("test");

        //Find the button to login and click it
        cy.get('.btn-primary').click();

        //Wait for the @login-stub to be called by the click event.
        cy.wait("@login");


        //The @login-stub is called, check the contents of the incoming request.
        cy.get("@login").should((xhr) => {
            //The username should match what we type earlier
            expect(xhr.request.body.username).equals("test");


            expect(xhr.request.body.password).equals("test");

        });

        //After a succesful login the url should now contain #welcome
        cy.url().should("contain", "#welcome");
    });


//Test: failed login
    it("Failed login", () => {
        cy.server();

        cy.route({
            method: "POST",
            url: "/user/login",
            response: {
                reason: "ERROR"
            },
            status: 401
        }).as("login");

        cy.get('#inputPassword').type("test");

        //Find the field for the password and type the text "test"
        cy.get('#inputPassword').type("test");

        //Find the button to login and click it
        cy.get('.btn-primary').click();

        //Wait for the @login-stub to be called by the click event.
        cy.wait("@login");

        cy.get(".error").should("exist").should("contain", "ERROR");
    });
});