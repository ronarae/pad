/**
 * @author Yazan Mousa
 * this class is resposible for makeing a group for users.
 */

class GroupController {
    constructor() {
        this.groupRepository = new GroupRepository();
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

    async onAddEvent(event) { // om niet met callbacks te werken

        event.preventDefault(); // wist ik niet
        //om bij een form niet te refrshen

        //verzamelen van form gegevens
        const name = this.createGroupView.find("#inputGroupsName").val();
        const user_id = sessionManager.get("user_id");

        console.log(name);
        // versturen naar repostory

        //await this.groupRepository.create(name, user_id);
        try{
            const groupId = await this.groupRepository.create(name, user_id); // wist ik niet
            console.log(groupId);
            app.loadController(CONTROLLER_WELCOME);
        } catch (e) {
            console.log(e);
        }

       


    }
    error() {
       $(".content").html("Failed to load content")
    }

// kijken of de naam al bestaat
    // camel case gebruiken overal
}