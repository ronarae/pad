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
        this.createGroupView.find("#submit").on("click", (event) => this.onAddEvent(event))

        $("#addSelContact").on("click", (event) => this.addContact(event));



    this.getAllContacts();
    }

    async onAddEvent(event) { // om niet met callbacks te werken

        event.preventDefault();
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

                try{
                    //After creating group, update contact's group_id on the proper group
                    //variable of sel array
                    // let contacts = ;
                    const sel = this.getArray();
                    for (let i = 0; i < sel.length ; i++) {
                        console.log(sel[i]);
                        const contactUpdate = await this.groupRepository.contactAdd(groupId, sel[i]);
                        console.log(contactUpdate);
                    }

                }catch (e) {
                    console.error(e);
                }


                app.loadController(CONTROLLER_GROUP_PAGE);
            } catch (e) {
                console.log(e);
            }
        }
    }


    getArray(){
        let sel = $('input[type=checkbox]:checked').map(function(_, el) {
            return $(el).val();
        }).get();
        console.log(sel);
        return sel;
    }

    addContact(event){
        event.preventDefault();
        console.log("Add contact button pressed");
        //Get selected contact's id

         const contact = this.getArray();

        try{


            let contactTable = $("#rowSel");
            contactTable.empty();

            for (let i = 0; i < contact.length; i++) {
                let nextContact = "<li>";
                nextContact += `<a>${contact[i]}</a>`;
                nextContact += `<span class="close">\u00D7</span>`;
                nextContact += "</li>";

                contactTable.append(nextContact);
            }


        }catch (e) {
            console.error(e);
        }

    }

    async getAllContacts(){
        const user_id = sessionManager.get("user_id");

        const contactList = $("#contacts");
        try{
            const contactData = await this.groupRepository.getAllContact(user_id);


            for(let i = 0; i < contactData.length; i++){
                let nextContact = "<tr>";
                nextContact += `<td><input type="checkbox" class=" boxform-check-input" id="conCheckBox"value="${contactData[i].contact_id}"><span class="checkmark"></span></td>"`;
                nextContact += `<td data-contactFname = "${contactData[i].firstname}">${contactData[i].firstname}</td>`;
                nextContact += `<td data-contactSurname = "${contactData[i].surname}">${contactData[i].surname}</td>`;
                nextContact += `<td>${contactData[i].phonenumber}</td>`;
                nextContact += "</tr>";

                contactList.append(nextContact);
            }

            // this.createGroupView.find('#addSelContact').on("click", (event) =>{
            //     event.preventDefault();
            //     let sel = [];
            //
            //     $.each($('input[type=checkbox]:checked'), ()=>{
            //         const contactName = event.currentTarget.dataset.contactFname;
            //         const contactSurname = this.createGroupView.data("contactSurname", event.currentTarget.dataset.contactSurname);
            //         sel.push( event.currentTarget.dataset.contactFname+ " "+ contactSurname );
            //     });
            //
            //
            //     console.log(sel);
            //
            //     try{
            //
            //         let contactTable = $("#selRow");
            //         for (let i = 0; i < sel.length; i++) {
            //             let nextContact = "<tr>";
            //             nextContact += `<td>{$sel[i]}</td>;`
            //
            //             nextContact += "</tr>";
            //
            //             contactTable.append(nextContact);
            //         }
            //     }catch (e) {
            //         console.error(e);
            //     }
            //
            // })


        }catch (e) {
            console.error(e);
            contactList.text(e)
        }
    }

    error() {
       $(".content").html("Failed to load content")
    }
}