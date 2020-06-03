//Context: contactPage
describe("contactPage", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test"};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#contactPage");
    });

    //Test: Visit contactPage via navbar
    it("Visit contactPage via navbar", () => {
        //Open contactPage page via navbar
        cy.get('.navbar-nav').contains('Contacten').click({force:true})
    });

    //Test: Validate edit contact form
    it("Validate edit contact form", () => {
        //Find the field for the firstname, check if it exists.
        cy.get("#inputFirstname").should("exist");

        //Find the field for the surname, check if it exists.
        cy.get("#inputSurname").should("exist");

        //Find the field for the adres, check if it exists.
        cy.get("#inputAddress").should("exist");

        //Find the field for the emailadres, check if it exists.
        cy.get("#inputEmailaddress").should("exist");

        //Find the field for the phonenumber, check if it exists.
        cy.get("#inputPhonenumber").should("exist");

        //Find the field for the button edit, check if it exists.
        cy.get("#editModal").should("exist");

        //Find the field for the button delete, check if it exists.
        cy.get("#deluser_modal").should("exist");
    });

    //Test: Successful update contact
    it("Successful update contact", () => {
        //Start fake server
        cy.server();
       cy.get("#editModal").click({force:true});

       cy.route("POST", "/contactPage/update").as("contactPage");

        // Add a stub with the URL /user/contactPage as a POST
        // Respond with a JSON-object when requested
        // Give the stub the alias: @contactPage
        // Find the field for the firstname, and type the text "testEditFirstname".
        cy.get("#inputFirstname").type("testEditFirstname");

        // Find the field for the firstname, and type the text "testEditSurname".
        cy.get("#inputSurname").type("testEditSurname");

        // Find the field for the firstname, and type the text "123456789".
        cy.get("#inputPhonenumber").type("123456789");

        // Find the field for the firstname, and type the text "testEditEm@ailaddress"
        cy.get("#inputEmailaddress").type("testEditEm@ailaddress");

        // Find the field for the firstname, and type the text "testEditAdres"
        cy.get("#inputAddress").type("testEditAdres");

        //Find the button to save and click it.
        cy.get("#modal-submit").click();

        //Wait for the @contactPage-stub to be called by the click-event.
        cy.url().should("contain", "#contactPage");
       //cy.wait("@contactPage");

        cy.get("@contactPage").log((xhr) => {
            //The username should match what we typed earlier
            expect(xhr.request.body.firstname).equals("abc");
        });
    });
});