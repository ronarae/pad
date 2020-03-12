/**
 * ContactController is responsible for all Contact related actions
 * @author Niels Roeleveld
 */

class ContactController {
    constructor() {
        this.contactRepository = new contactRepository;

        $.get("views/contact.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {
        this.contactView = $(htmlData);

        //toevoegen html aan .content div
        $(".content").empty().append(this.contactView);

        this.contactView.find(".btn").on("click", (event) => this.onAddEvent(event))
    }

    async onAddEvent(event) {
        event.preventDefault();

        //Verzamelen van form gegevens
        const firstname = this.contactView.find("#inputFirstname").val();
        const surname = this.contactView.find("#inputSurname").val();
        const phonenumber = this.contactView.find("#inputPhonenumber").val();
        const emailaddress = this.contactView.find("#inputEmailaddress").val();
        const address = this.contactView.find("#inputAddress").val();

        console.log(`${firstname} - ${surname} - ${phonenumber} - ${emailaddress} - ${address}`);

        //Versturen naar repository
        try {
            const eventId = await this.contactRepository.create(firstname, surname, phonenumber, emailaddress, address);
            console.log(eventId);
            app.loadController(CONTROLLER_WELCOME);
        } catch (e) {
            console.log(e);
            //TODO: show appropriate error to user
        }
    }

    error() {
        $(".content").html("Failed to load content")
    }
}