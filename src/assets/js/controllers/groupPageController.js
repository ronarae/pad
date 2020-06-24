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
        // this.groupPageView.find(".name").html(sessionManager.get("username"));



        this.groupPageView.find("#editbutton").on("click", (event) => {
            console.log("edit button")
            $(".modal-body").toggle(function () {
                this.animate({height:400},200);
            },function () {
                this.animate({height:200},200);
            })
        })

        //Update the groups value
        this.groupPageView.find("#modal-submit").on("click", (event) => this.update(event));


        //Get ungrouped contact's
        this.groupPageView.find("#openContactButton").on("click", (event) => this.getUngroup(event));

        //Update contact to new group
        this.groupPageView.find("#AddContacts").on("click", (event)=> this.addContact(event));


        //Delete contact from group
        this.groupPageView.find("#del-contact-submit").on("click", (event => this.removeContact(event)));


        //Delete the group
        this.groupPageView.find("#del-modal-submit").on("click", (event)=> this.delete(event));
        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.groupPageView);

        this.getAll();
    }




    //Get function of selected contact's
    getArray(){
        let sel = $('input[type=checkbox]:checked').map(function(_, el) {
            return $(el).val();
        }).get();
        console.log(sel);
        return sel;
    }

    //Add new contact's to the group
    async addContact(event){
        event.preventDefault();
        console.log("Start add contact")

        const group_id = this.groupPageView.find("#openContactButton").attr("data-groupid");
        const newGroup = this.getArray();

        console.log( " group id "+group_id+" contact id "+newGroup);

        try{
            for (let i = 0; i < newGroup.length; i++) {
                const addContact = await this.groupRepository.contactAdd(group_id,newGroup[i]);
                console.log(addContact);
            }

        }catch (e) {
            console.error(e);
        }finally {
            this.groupPageView.find("#editModal").modal('toggle');
            await this.getContact( this.groupPageView.find("#inputGroupName").data("groupId"));
        }


    }


    //Get all ungrouped contact's
    async getUngroup(event){
        event.preventDefault();
        const user_id = sessionManager.get("user_id");

        this.groupPageView.find("#editModal").modal('toggle');

        const groupTable = $("#unselectedContacts");

        try{
            groupTable.empty();
            const ungroupData = await this.groupRepository.getUngroup(user_id);

            if(ungroupData == 0){
                console.log("Geen ungrouped contacts meer, voeg meerder contacten");
                const errorMsg = `<h2>Er zijn geen beschikbare contacten meer</h2>`;

                groupTable.append(errorMsg);
            }else{
                for (let i = 0; i <ungroupData.length ; i++) {
                    let nextGroup = "<tr>";
                    nextGroup += `<td><input type="checkbox" class=" boxform-check-input" id="ungroupSelect"value="${ungroupData[i].contact_id}"><span class="checkmark"></span></td>"`;
                    nextGroup += `<td>${ungroupData[i].firstname}</td>`;
                    nextGroup += `<td>${ungroupData[i].surname}</td>`;
                    nextGroup += `<td>${ungroupData[i].phonenumber}</td>`;

                    nextGroup += "</tr>";

                    groupTable.append(nextGroup);
                }
            }


        }catch (e) {
            console.error(e);
        }
    }



    //om alle toegevoegde contacten op te halen
    async getAll() {
        const user_id = sessionManager.get("user_id");

        const groupTable = $("#groups");

        try {
            const groupData = await this.groupRepository.getAll(user_id);


            for (let i = 0; i < groupData.length; i++) {
                let nextGroup = "<tr>";
                nextGroup += `<td>${groupData[i].name}</td>`;
                nextGroup += `<td> 
                                <a class= "groupEdit btn btn-info" data-toggle="modal" data-target="#editModal" 
                                data-contact="${groupData[i]}" data-groupid = "${groupData[i].groupId}" id="editbutton" 
                                data-name = "${groupData[i].name}" >Overzicht</a>             
                                <a class = "groupDelete btn btn-danger" data-toggle="modal" data-target="#deleteModal" 
                                data-groupid = "${groupData[i].groupId}">Verwijder </a>`;

                nextGroup += "</tr>";

                groupTable.append(nextGroup);
            }

            $('.groupEdit').on("click", (event) => {
                console.log("start groupEdit");
                this.groupPageView.find("#inputGroupName").val(event.currentTarget.dataset.name);
                this.groupPageView.find("#inputGroupName").data("groupId", event.currentTarget.dataset.groupid);
                console.log(event.currentTarget.dataset.groupid);
                this.getContact(event.currentTarget.dataset.groupid);
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


    //Promise get contact from group
    async getContact(id){
        console.log("Get groupId "+ id);
        const groupId = id;


        //after loading groupid, attach groupid to future add function
        this.groupPageView.find("#openContactButton").attr("data-groupid",groupId);

        const groupTable = $("#contacts");

        try{
            //Clear modal before requesting data
            groupTable.empty();
            const groupData = await this.groupRepository.getGroupContact(groupId);

                for (let i = 0; i < groupData.length; i++) {
                    let nextGroup = "<tr>";
                    nextGroup += `<td>${groupData[i].firstname}</td>`;
                    nextGroup += `<td>${groupData[i].surname}</td>`;
                    nextGroup += `<td>${groupData[i].phonenumber}</td>`;
                    nextGroup += `<td>${groupData[i].address}</td>`;
                    nextGroup += `<td>${groupData[i].emailaddress}</td>`;
                    nextGroup += `<td>            
                                <button type="button" class="removeContact btn btn-danger" data-toggle="modal" data-target="#deleteContact" 
                                data-contactId = "${groupData[i].contact_id}">Verwijder </button>
                                </td>`;

                    nextGroup += "</tr>";

                    groupTable.append(nextGroup);

                }

        }catch (e) {
            console.error(e);
        }
    }

    //Remove contact from group
    async removeContact(event){
        event.preventDefault();

        const contactId = this.groupPageView.find(".removeContact").data("contactid");
        console.log("Selecting contact to be removed " + contactId);

        try{
            const removeContactData = await this.groupRepository.removeContact(contactId);
            console.log("Removed contact "+removeContactData);
        }catch (e) {
            console.error(e);
        }finally {
            await this.getContact( this.groupPageView.find("#inputGroupName").data("groupId"));
        }
    }

    //Delete group
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
        event.preventDefault();
        // console.log("start update");
        const groupId = this.groupPageView.find("#inputGroupName").data("groupId");
        // console.log(groupId + " hello");
        const newName = this.groupPageView.find("#inputGroupName").val();


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