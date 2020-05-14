/**
 * @author Yazan Mousa & Niels Roeleveld
 * this class is responsible for making a group for users.
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

        // event.preventDefault();
        //om bij een form niet te refreshen

        //verzamelen van form gegevens
        const name = this.createGroupView.find("#inputGroupsName").val();
        const user_id = sessionManager.get("user_id");
        
        //Error strings
        this.groupname = "Groepnaam";
        this.emptyField = " mag niet leeg zijn";
        const errors = [];

        //Check groupname
        if (name.length === 0 || name.match(/^\s*$/)) { //empty field
            document.getElementById("inputGroupsName").setCustomValidity(this.groupname + this.emptyField);
            errors.push({
                message: this.groupname + this.emptyField
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
                console.log(`${name}`);
                const groupId = await this.groupRepository.create(name, user_id);
                console.log(groupId);
                app.loadController(CONTROLLER_GROUP_PAGE);
            } catch (e) {
                console.log(e);
            }
        }
    }

    error() {
       $(".content").html("Failed to load content")
    }

// kijken of de naam al bestaat
    // camel case gebruiken overal
}