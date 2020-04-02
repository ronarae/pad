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

    // myApp = angular.module("myapp", []);
    // myApp.controller("PasswordController", function($scope) {
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
    // }

}