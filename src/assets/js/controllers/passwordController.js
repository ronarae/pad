/**
 * resetEmailController is responsible for sending the password reset email
 * @author Niels Roeleveld
 */

class PasswordController {
    constructor() {
        this.passwordRepository = new passwordRepository;

        $.get("views/password.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {
        this.passwordView = $(htmlData);

        //toevoegen html aan .content div
        $(".content").empty().append(this.passwordView);

        this.passwordView.find(".btn").on("click", (event) => this.onAddEvent(event))
    }

    async onAddEvent(event) {
        event.preventDefault();

        //Verzamelen van form gegevens
        const emailaddress = this.registerView.find("#inputEmailaddress").val();

        //Error strings
        this.emailaddress = "Emailadres";
        this.emptyField = " mag niet leeg zijn";
        this.emailField = " moet een @ bevatten";
        const errors = [];

        //Check emailaddress
        if (emailaddress.length === 0 || emailaddress.match(/^\s*$/)) { //empty field
            errors.push({
                message: this.emailaddress + this.emptyField
            });
        } else if (!emailaddress.match("@")) { //doesn't contain a @
            errors.push({
                message: this.emailaddress + this.emailField
            });
        }

        //Check if errors did occur
        if (0 < errors.length) {
            //Show errors
            let messages = "";
            for (let i = 0; i < errors.length; i++) {
                messages += errors[i].message + "\n";
            }
            alert(messages)
        } else {
            try { //Send email
                console.log(`${emailaddress}`);

                //TODO: Send reset email
                const nodemailer = require('nodemailer');

                async function main() {
                    let testAccount = await nodemailer.createTestAccount();

                    let transporter = nodemailer.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        auth: {
                            user: "pad-email",
                            pass: "pad-email-ww"
                        }
                    });

                    let info = await transporter.sendMail({
                        from: '"BENS8 " <noreply@bens8.com>', // sender address
                        to: "nielsroe.bmx@gmail.com, niels.roeleveld@hva.nl", // list of receivers
                        subject: "Subject", // Subject line
                        text: "Text", // plain text body
                        html: "Html" // html body
                    });

                    console.log("Message sent: %s", info.messageId);
                }

                // module.exports = {
                //     sendMail
                // };
                main().catch(console.error);

                console.log(eventId);
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