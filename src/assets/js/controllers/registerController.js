/**
 * RegisterController is responsible for all Register related actions
 * @author Niels Roeleveld
 */

class RegisterController {
    constructor() {
        this.registerRepository = new registerRepository;

        $.get("views/register.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {
        this.registerView = $(htmlData);

        //toevoegen html aan .content div
        $(".content").empty().append(this.registerView);

        this.registerView.find(".btn").on("click", (event) => this.onAddEvent(event))
    }

    async onAddEvent(event) {
        event.preventDefault();

        //Verzamelen van form gegevens
        const username = this.registerView.find("#inputUsername").val();
        const emailaddress = this.registerView.find("#inputEmailaddress").val();
        const password = this.registerView.find("#inputPassword").val();

        console.log(`${username} - ${emailaddress} - ${password}`);

        //Versturen naar repository
        try {
            const eventId = await this.registerRepository.create(username, emailaddress, password);
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