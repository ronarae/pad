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
    $(document).ready(function() {
    var userId = FYSCloud.Session.get("userId");
    if (userId) {
        FYSCloud.URL.redirect("login.html", {
            id: userId
        });
    }

    $("#loginButton").on("click", function(e) {
        e.preventDefault();
        const feedback = document.getElementById("feedback");
        var email = document.getElementById("email").value;
        var wachtwoord = document.getElementById("wachtwoord").value;

        if (!email || !wachtwoord) {
            throw (feedback.innerHTML = "Niet alle velden zijn ingevuld!");
        }
        FYSCloud.API.queryDatabase(
            "SELECT * FROM gebruiker WHERE email = ? AND wachtwoord = ? AND actief = TRUE",
            [email, wachtwoord]
        )
            .done(function(data) {
                if (data[0]) {
                    var profileId = data[0].id;
                    //Set userId
                    FYSCloud.Session.set("userId", profileId);
                    //Redirect page to an URL with querystring
                    FYSCloud.URL.redirect("profiel.html", {
                        id: profileId
                    });
                } else {
                    throw (feedback.innerHTML = "Gebruiker bestaat niet.");
                }
            })
            .fail(function(reason) {
                console.log(reason);
                throw (feedback.innerHTML = "Gebruiker bestaat niet.");
            });
    });



        // error() {
    //     $(".content").html("Failed to load content")
    // }
    //
    // myApp = angular.module("myapp", []);
    // myApp.controller("PasswordController", function($scope) {

        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        $scope.passwordStrength = {
            "float": "left",
            "width": "100px",
            "height": "23px",
            "margin-left": "7px"
        };

        $scope.analyze = function (value) {
            if (strongRegex.test(value)) {
                $scope.passwordStrength["background-color"] = "green";
            } else if (mediumRegex.test(value)) {
                $scope.passwordStrength["background-color"] = "orange";
            } else {
                $scope.passwordStrength["background-color"] = "red";
            }
        };

    }

}
