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


    // $(document).ready(function()) {
    // var userId = FYSCloud.Session.get("userId");
    // if (userId) {
    //     FYSCloud.URL.redirect("login.html", {
    //         id: userId
    //     });
    // }
    //
    // $("#loginButton").on("click", function(e) {
    //     e.preventDefault();
    //     const feedback = document.getElementById("feedback");
    //     var email = document.getElementById("email").value;
    //     var wachtwoord = document.getElementById("wachtwoord").value;
    //
    //     if (!email || !wachtwoord) {
    //         throw (feedback.innerHTML = "Niet alle velden zijn ingevuld!");
    //     }
    //     FYSCloud.API.queryDatabase(
    //         "SELECT * FROM gebruiker WHERE email = ? AND wachtwoord = ? AND actief = TRUE",
    //         [email, wachtwoord]
    //     )
    //         .done(function(data) {
    //             if (data[0]) {
    //                 var profileId = data[0].id;
    //                 //Set userId
    //                 FYSCloud.Session.set("userId", profileId);
    //                 //Redirect page to an URL with querystring
    //                 FYSCloud.URL.redirect("profiel.html", {
    //                     id: profileId
    //                 });
    //             } else {
    //                 throw (feedback.innerHTML = "Gebruiker bestaat niet.");
    //             }
    //         })
    //         .fail(function(reason) {
    //             console.log(reason);
    //             throw (feedback.innerHTML = "Gebruiker bestaat niet.");
    //         });
    // });
    // $("#wachtwoordWijzigen").on("click", function(e) {
    //     e.preventDefault();
    //     var email = document.getElementById("herstelEmail").value;
    //
    //     if (!email) {
    //         throw (feedback.innerHTML = "Vul geldig email adres in.");
    //     }
    //     //resetToken = Math.floor(Math.random() * 1000000000);
    //
    //     FYSCloud.API.queryDatabase(
    //         "SELECT * FROM gebruiker WHERE email = ? AND actief = true",
    //         [email]
    //     )
    //         .done(function(data) {
    //             FYSCloud.API.queryDatabase(
    //                 "UPDATE gebruiker SET resetToken = ? WHERE email = ? AND actief = TRUE",
    //                 [resetToken, email]
    //             ).done(function(data) {
    //                 sendEmail(resetToken, email);
    //             });
    //         })
    //         .fail(function(reason) {
    //             console.log(reason);
    //             throw (feedback.innerHTML = "Gebruiker bestaat niet.");
    //         });
    // });
    //

    // // function sendEmail(resetToken, email) {
    // //     var bericht = `
    // //
    //
    //
    //
    //     // error() {
    // //     $(".content").html("Failed to load content")
    // // }
    // //
    // // myApp = angular.module("myapp", []);
    // // myApp.controller("PasswordController", function($scope) {
    //
    //     var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    //     var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    //
    //     $scope.passwordStrength = {
    //         "float": "left",
    //         "width": "100px",
    //         "height": "23px",
    //         "margin-left": "7px"
    //     };
    //
    //     $scope.analyze = function (value) {
    //         if (strongRegex.test(value)) {
    //             $scope.passwordStrength["background-color"] = "green";
    //         } else if (mediumRegex.test(value)) {
    //             $scope.passwordStrength["background-color"] = "orange";
    //         } else {
    //             $scope.passwordStrength["background-color"] = "red";
    //         }
    //     };
    //
    // });

//
//         // error() {
//     //     $(".content").html("Failed to load content")
//     // }
//     //
//     // myApp = angular.module("myapp", []);
//     // myApp.controller("PasswordController", function($scope) {
//
//         var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
//         var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
//
//         $scope.passwordStrength = {
//             "float": "left",
//             "width": "100px",
//             "height": "23px",
//             "margin-left": "7px"
//         };
//
//         $scope.analyze = function (value) {
//             if (strongRegex.test(value)) {
//                 $scope.passwordStrength["background-color"] = "green";
//             } else if (mediumRegex.test(value)) {
//                 $scope.passwordStrength["background-color"] = "orange";
//             } else {
//                 $scope.passwordStrength["background-color"] = "red";
//             }
//         };
//
//     }
//
// }

}