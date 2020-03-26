/**
 * ContactPage Controller
 * update contact and contact
 *
 * @author Rona Rieza
 */

class ContactPageController {
    constructor() {
       this.contactPageRepository = new ContactPageRepository();

        $.get("views/contactPage.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {
        this.contactPageView = $(htmlData);

        this.contactPageView.find("#firstname").html(sessionManager.get("firstname"));

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.contactPageView);

        //this.fetchRooms(121);
    }

    async fetchRooms(contact_id) {
        const exampleResponse = this.contactPageView.find(".example-response");
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const roomData = await this.contactPageRepository.get(contact_id);

            exampleResponse.text(JSON.stringify(roomData, null, 4));
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            exampleResponse.text(e);
        }
    }



    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}