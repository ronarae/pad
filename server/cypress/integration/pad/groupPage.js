//Contect visit page

describe("Group", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        const session = {"username": "test", "user_id": 5};
        localStorage.setItem("session", JSON.stringify(session));
        cy.visit("http://localhost:8080/#groupPage");
    });

    //Test: Successful login
    it("Successful login", () => {
        // // Start a fake server
        cy.server();



        cy.get('.navbar-nav').contains('Groepen').click();


    });



    // Test: navigate to groupPage
    it("groupPage navigation", () => {
        cy.server();
        cy.visit("http://localhost:8080/#groupPage");
        cy.url().should("contain", "#groupPage");
        cy.route("POST", "/groupPage", {user_id: "5"}).as("get");
        cy.wait("@get");

        cy.get("@get").should((xhr) => {
            //The user_id should match what we typed earlier
            expect(xhr.request.body.user_id).equals(5);
        });


        context("Load data",()=>{
            cy.get('#groups td')
                .should('have.length', 1)
                .and('contain','boodschappen');


            cy.route('GET', '/groupPage', {
                user_id: 5
            });
        });

    });


    //Test: finding user


});
