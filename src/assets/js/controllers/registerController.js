class RegisterController {
    constructor() {
        this.userRepository = new UserRepository();

        $.get("views/register.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    setup(data) {
        this.registerView = $(data);
        $(".content").empty().append(this.registerView);
    }


    //Called when the login.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }
}