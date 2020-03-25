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

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.contactPageView);

        this.contactPageView.find(".btn").on("click", (event) => this.onAddEvent(event))

    }

    async onAddEvent(event) {
        event.preventDefault();

        console.log(name);
        // versturen naar repostory

        this.contactPageRepository.create(name);
        try{
            const eventId = await this.contactPageRepository.create(name);
            console.log(eventId);
            app.loadController(CONTROLLER_CONTACT_PAGE);
        } catch (e) {
            console.log(e);
            //TODO: show appropriate error to user
        }
    }

    //Called when the login.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}