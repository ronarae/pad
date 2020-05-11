/**
 * ContactController is responsible for all Contact related actions
 * @author Niels Roeleveld & Wing Fung Lam
 */

class ContactController {
    constructor() {
        this.contactRepository = new ContactRepository;

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
        const user_id = sessionManager.get("user_id");

        //Error strings
        this.firstname = "Voornaam";
        this.surname = "Achternaam";
        this.phonenumber = "Telefoonnummer";
        this.emailaddress = "Emailadres";
        this.address = "Adres";
        this.emptyField = " mag niet leeg zijn";
        this.numberField = " mag alleen cijfers bevatten";
        this.textField = " mag geen cijfers bevatten";
        this.emailField = " moet een @ bevatten";
        const errors = [];

        //Check firstname
        if (firstname.length === 0 || firstname.match(/^\s*$/)) { //empty field
            errors.push({
                message: this.firstname + this.emptyField
            });
        } else if (firstname.match("[0-9]")) { //number
            errors.push({
                message: this.firstname + this.textField
            });
        }

        //Check surname
        if (surname.match("[0-9]")) { //numbers
            errors.push({
                message: this.surname + this.textField
            });
        }

        //Check phonenumber
        if (phonenumber.length === 0 || phonenumber.match(/^\s*$/)) { //empty field
            errors.push({
                message: this.phonenumber + this.emptyField
            });
        } else if (phonenumber.match("[^0-9]")) { //not a number
            errors.push({
                message: this.phonenumber + this.numberField
            });
        }

        //Check emailaddress
        if (emailaddress.length !== 0 && !emailaddress.match("@")) { //not empty and doesn't contain a @
            errors.push({
                message: this.emailaddress + this.emailField
            });
        }

        //Check if errors did occur
        if (0<errors.length) {
            //Show errors
            let messages = "";
            for(let i=0; i<errors.length; i++){
                messages += errors[i].message + "\n";
            }
            alert(messages)
        } else {
            try { //Send to database
                console.log(`${firstname} - ${surname} - ${phonenumber} - ${emailaddress} - ${address}`);
                const eventId = await this.contactRepository.create(firstname, surname, phonenumber, emailaddress, address, user_id);
                console.log(eventId);
                app.loadController(CONTROLLER_CONTACT_PAGE);
            } catch (e) {
                console.log(e);
                //TODO: show appropriate error to user
            }
        }
    }

    error() {
        $(".content").html("Failed to load content")
    }
}

