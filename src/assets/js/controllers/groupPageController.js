/**
 * ContactPage Controller
 * Toegevoegde groepen kunnen bekijken
 *
 * @author Rona Rieza
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

        //Update the contact's values
       // this.groupPageView.find("#modal-submit").on("click", (groupId) => this.update(groupId));

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.groupPageView);

        this.getAll();
    }

    //om alle toegevoegde contacten op te halen
    //groep edit need t be fixed -rona
    async getAll() {
        const user_id = sessionManager.get("user_id");

        try {
            const groupData = await this.groupRepository.getAll(user_id);

            const groupTable = $("#groups");
            for (let i = 0; i < groupData.length; i++) {
                let nextGroup = "<tr>";
                nextGroup += `<td>${groupData[i].name}</td>`;
                nextGroup += `<td> <a class = "groupDelete btn btn-danger" data-groupid = "${groupData[i].groupId}">Delete </a>
                                <a class= "groupEdit btn btn-success" data-toggle="modal" data-target="#editModal" 
                                data-contact="${groupData[i]}" data-groupid = "${groupData[i].groupId}" id="editbutton" 
                                data-name = "${groupData[i].name}" >Edit</a> `;
                nextGroup += "</tr>";

                groupTable.append(nextGroup);
            }
            $('.groupDelete').on("click", (event) => { console.log(event.currentTarget.dataset.groupid);
            const groupId = event.currentTarget.dataset.groupid;
            this.delete(groupId);
            });
            $('.groupEdit').on("click", (event) => {
                console.log(event.currentTarget.dataset.groupid + "line 57");
                const groupId = event.currentTarget.dataset.groupid;
                console.log(event.currentTarget.dataset.name + "line 59");
                const name = event.currentTarget.dataset.name;

                this.update(groupId, name);
            });


        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            groupData.text(e)
        }
    }

    async delete(groupId){
        try {
            const groupDeleteData = await this.groupRepository.delete(groupId);
            console.log(groupDeleteData);
            
            $.get("views/groupPage.html")
                .done((htmlData) => this.setup(htmlData))
                .fail(() => this.error());
        } catch (e) {
            console.log(e);

        }

    }

    //to be fixed -rona
    async update(groupId, name) {
        console.log("start update");
        const groupName = this.groupPageView.find("#groupName").val();
        console.log(groupName);
        try {

            const groupUpdateData = await this.groupRepository.update(groupId,groupName);
            console.log(groupUpdateData);


        } catch (e) {
            console.log(e);

        }
    }



    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}