/**
 * GroupPage Controller
 *
 * Toegevoegde groepen kunnen bekijken
 * Groep naam wijzigen en verwijderen
 *
 * @author Rona Rieza, Yazan Mouza, Wing Fung Lam
 */

class GroupPageController {
    constructor() {
        this.groupRepository = new GroupRepository();

        $.get("views/groupPage.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());

    }

    setup(htmlData) {
        this.groupPageView = $(htmlData);

        //Set the name in the view from the session
        this.groupPageView.find(".name").html(sessionManager.get("username"));

        //Update the groups value
        this.groupPageView.find("#modal-submit").on("click", (event) => this.update(event));


        //Delete the group
        this.groupPageView.find("#del-modal-submit").on("click", (event)=> this.delete(event));
        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.groupPageView);

        this.getAll();
    }

    //om alle toegevoegde contacten op te halen
    async getAll() {
        const user_id = sessionManager.get("user_id");

        const groupTable = $("#groups");
        //     $("#editModal").modal('hide');
        //
        //     //refresh na 1 second
        //     setTimeout(function(){
        //         window.location.reload();
        //     }, 1000);
        try {
            const groupData = await this.groupRepository.getAll(user_id);

            // const groupTable = $("#groups");
            for (let i = 0; i < groupData.length; i++) {
                let nextGroup = "<tr>";
                nextGroup += `<td>${groupData[i].name}</td>`;
                nextGroup += `<td> 
                                <a class= "groupEdit btn btn-success" data-toggle="modal" data-target="#editModal" 
                                data-contact="${groupData[i]}" data-groupid = "${groupData[i].groupId}" id="editbutton" 
                                data-name = "${groupData[i].name}" >Edit</a>             
                                <a class = "groupDelete btn btn-danger" data-toggle="modal" data-target="#deleteModal" 
                                data-groupid = "${groupData[i].groupId}">Delete </a>`;

                nextGroup += "</tr>";

                groupTable.append(nextGroup);
            }

            $('.groupEdit').on("click", (event) => {
                console.log("start groupEdit");
                this.groupPageView.find("#inputGroupName").val(event.currentTarget.dataset.name);
                this.groupPageView.find("#inputGroupName").data("groupId", event.currentTarget.dataset.groupid);
                console.log(event.currentTarget.dataset.groupid);
            });

            $('.groupDelete').on("click", (event) => {
                console.log(event.currentTarget.dataset.groupid);
                const groupId = event.currentTarget.dataset.groupid;
                this.groupPageView.find("#inputGroupName").data("groupId",groupId);
            });

        } catch (e) {
            console.log("error while fetching rooms", e);
            //for now just show every error on page, normally not all errors are appropriate for user
            groupData.text(e)
        }
    }

    async delete(event){
        event.preventDefault();
        const groupId = this.groupPageView.find("#inputGroupName").data("groupId");
        try {
            const groupDeleteData = await this.groupRepository.delete(groupId);
            console.log(groupDeleteData);

        } catch (e) {
            console.log(e);
        }finally {
          setTimeout(function () {
                window.location.reload();
          }, 1000);
            $("#deleteModal").modal('hide');
        }
    }

    //to be fixed -rona
    async update(event) {
        // event.preventDefault();
        // console.log("start update");
        const groupId = this.groupPageView.find("#inputGroupName").data("groupId");
        // console.log(groupId + " hello");
        const newName = this.groupPageView.find("#inputGroupName").val();
        // try {
        //     const groupUpdateData = await this.groupRepository.update(groupId,newName);
        //     console.log(newName);
        //     console.log(groupUpdateData);
        //
        //     $("#editModal").modal('hide');
        //
        //     //refresh na 1 second
        //     setTimeout(function(){
        //         window.location.reload();
        //     }, 1000);
        //
        // } catch (e) {
        //     console.log(e);
        //
        // }

        //Error strings
        this.newgroupname = "Groepnaam";
        this.emptyField = " mag niet leeg zijn";
        const errors = [];

        //Check groupname
        if (newName.length === 0 || newName.match(/^\s*$/)) { //empty field
            document.getElementById("inputGroupName").setCustomValidity(this.newgroupname + this.emptyField);
            errors.push({
                message: this.newgroupname + this.emptyField
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
                const groupUpdateData = await this.groupRepository.update(groupId,newName);
                console.log(groupUpdateData);
                app.loadController(CONTROLLER_GROUP_PAGE);
            } catch (e) {
                console.log(e);
            } finally {
                //refresh na 1 second
                setTimeout(function(){
                    window.location.reload();
                }, 1000);

                console.log("Finally, close modal");
                $("#editModal").modal('hide');
            }
        }
    }

    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}