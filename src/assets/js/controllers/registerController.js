/**
 * RegisterController is responsible for all Register related actions
 * @author Niels Roeleveld & Wing Fung Lam & Majdouline Hamdi
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
        const confirmPassword = this.registerView.find("#inputConfirmPassword").val();
        let hashPassword;

        //Error strings
        this.username = "Gebruikersnaam";
        this.emailaddress = "Emailadres";
        this.password = "Wachtwoord";
        this.confirmPassword = "Wachtwoorden komen niet overeen"
        this.emptyField = " mag niet leeg zijn";
        this.emailField = " moet een @ bevatten";
        this.passwordReq = " moet minimaal één kleine letter bevatten";
        this.passwordReq1 = " moet minimaal één hoofdletter bevatten";
        this.passwordReq2 = " moet minimaal één cijfer bevatten";
        this.passwordReq3 = " moet minimaal één speciaal teken bevatten";
        this.passwordReq4 = " moet minimaal 8 tekens lang zijn";
        this.fieldExists = " bestaat al in ons systeem";
        const errors = [];

        //Check username
        if (username.length === 0 || username.match(/^\s*$/)) { //empty field
            document.getElementById("inputUsername").setCustomValidity(this.username + this.emptyField);
            errors.push({
                message: this.username + this.emptyField
            });
        }

        //Check emailaddress
        if (emailaddress.length === 0 || emailaddress.match(/^\s*$/)) { //empty field
            document.getElementById("inputEmailaddress").setCustomValidity(this.emailaddress + this.emptyField);
            errors.push({
                message: this.emailaddress + this.emptyField
            });
        } else if (!emailaddress.match("@")) { //doesn't contain a @
            document.getElementById("inputEmailaddress").setCustomValidity(this.emailaddress + this.emailField);
            errors.push({
                message: this.emailaddress + this.emailField
            });
        }

        //Check password
        if (password.length === 0 || password.match(/^\s*$/)) { //empty field
            document.getElementById("inputPassword").setCustomValidity(this.password + this.emptyField);
            errors.push({
                message: this.password + this.emptyField
            });
        } else {
            if (!password.match("(?=.*[a-z])")) { //lower case text
                document.getElementById("inputPassword").setCustomValidity(this.password + this.passwordReq);
                errors.push({
                    message: this.password + this.passwordReq
                })
            }
            if (!password.match("(?=.*[A-Z])")) { //upper case text
                document.getElementById("inputPassword").setCustomValidity(this.password + this.passwordReq1);
                errors.push({
                    message: this.password + this.passwordReq1
                })
            }
            if (!password.match("(?=.*[0-9])")) { //numbers
                document.getElementById("inputPassword").setCustomValidity(this.password + this.passwordReq2);
                errors.push({
                    message: this.password + this.passwordReq2
                })
            }
            if (!password.match("(?=.*[!@#$%^&*])")) { //special characters
                document.getElementById("inputPassword").setCustomValidity(this.password + this.passwordReq3);
                errors.push({
                    message: this.password + this.passwordReq3
                })
            }
            if (!password.match("(?=.{8,})")) { //minimum of 8 characters
                document.getElementById("inputPassword").setCustomValidity(this.password + this.passwordReq4);
                errors.push({
                    message: this.password + this.passwordReq4
                })
            }
        }

        //Check password confirmation
        if (confirmPassword !== password) {
            document.getElementById("inputConfirmPassword").setCustomValidity(this.confirmPassword);
            errors.push({
                message: this.confirmPassword
            })
        }

        //Check if errors did occur
        if (0 < errors.length) {
            //Show errors
            let messages = "";
            for (let i = 0; i < errors.length; i++) {
                messages += errors[i].message + "\n";
            }
            console.log(messages)
        } else {
            try { //Send to database
                // hashPassword = CryptoJS.MD5(password);
                event.preventDefault();
                console.log(`${username} - ${emailaddress} - ${password}`);
                const eventId = await this.registerRepository.create(username, emailaddress, password);
                console.log(eventId);
                sessionManager.set("user_id",eventId['id']);
                sessionManager.set("username",username);
                console.log("User id "+ eventId['id']);
                app.loadController(CONTROLLER_WELCOME);

            } catch (e) {
                if (e.code === 401) {
                    this.registerView
                        .find(".error")
                        .html(e.reason);
                } else {
                    console.log(e);
                }
            }
        }
    }
}