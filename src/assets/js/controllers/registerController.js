/**
 * RegisterController is responsible for all Register related actions
 * @author Niels Roeleveld & Wing Fung Lam
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
        let inputCheck = false;


        if(username.length == "" || emailaddress.length == ""){
            alert("Geen lege velden achterlaten");
        }else{
            //Versturen naar repository
            try {
                console.log(`${username} - ${emailaddress} - ${password}` + inputCheck);
                const eventId = await this.registerRepository.create(username, emailaddress, password);
                console.log(eventId);
                app.loadController(CONTROLLER_WELCOME);
            } catch (e) {
                if(e.code === 401) {
                    this.registerView
                        .find(".error")
                        .html(e.reason);
                } else {
                    console.log(e);
                }
            }
        }
    }

    error() {
        $(".content").html("Failed to load content")
    }
}