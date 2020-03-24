/**
 * @author Yazan Mousa
 * this is class is resposible for making a group for users
 */

class GroupController {
    constructor() {
        this.groupRepository = new groupRepository();
        $.get("views/group.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {
        //toevoegen html aan .content div
        this.createGroupView = $(htmlData);

        $(".content").empty().append(this.createGroupView);
        this.createGroupView.find(".btn").on("click", (event) => this.onAddEvent(event))
    }

    async onAddEvent(event) {
        event.preventDefault();

        //verzamelen van form gegevens
        const name = this.createGroupView.find("#inputGroupsName").val();

        console.log(name);
        // versturen naar repostory

        this.groupRepository.create(name);
        try{
            const eventId = await this.groupRepository.create(name);
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