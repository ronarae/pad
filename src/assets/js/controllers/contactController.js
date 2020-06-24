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
            document.getElementById("inputFirstname").setCustomValidity(this.firstname + this.emptyField);
            errors.push({
                message: this.firstname + this.emptyField
            });
        } else if (firstname.match("[0-9]")) { //number
            document.getElementById("inputFirstname").setCustomValidity(this.firstname + this.textField);
            errors.push({
                message: this.firstname + this.textField
            });
        }

        //Check surname
        if (surname.match("[0-9]")) { //numbers
            document.getElementById("inputSurname").setCustomValidity(this.surname + this.textField);
            errors.push({
                message: this.surname + this.textField
            });
        }

        // Check phonenumber
        if (phonenumber.length === 0 || phonenumber.match(/^\s*$/)) { //empty field
            document.getElementById("inputPhonenumber").setCustomValidity(this.phonenumber + this.emptyField);
            errors.push({
                message: this.phonenumber + this.emptyField
            });
        } else if (phonenumber.match("[^0-9]")) { //not a number
            document.getElementById("inputPhonenumber").setCustomValidity(this.phonenumber + this.numberField);
            errors.push({
                message: this.phonenumber + this.numberField
            });
        }

        // Check emailaddress
        if (emailaddress.length !== 0 && !emailaddress.match("@")) { //not empty and doesn't contain a @
            document.getElementById("inputEmailaddress").setCustomValidity(this.emailaddress + this.emailField);
            errors.push({
                message: this.emailaddress + this.emailField
            });
        }

        // Check if errors did occur
        if (0 < errors.length) {
            //Show errors
            let messages = "";
            for (let i = 0; i < errors.length; i++) {
                messages += errors[i].message + "\n";
            }
            console.log(messages)
        } else {
            try { //Send to database
                event.preventDefault();
                console.log(`${firstname} - ${surname} - ${phonenumber} - ${emailaddress} - ${address}`);
                const eventId = await this.contactRepository.create(firstname, surname, phonenumber, emailaddress, address, user_id);
                console.log(eventId);
                app.loadController(CONTROLLER_CONTACT_PAGE);
            } catch (e) {
                console.log(e);
            }
        }
    }

    error() {
        $(".content").html("Failed to load content")
    }
}

