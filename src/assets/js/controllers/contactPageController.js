/**
 * ContactPage Controller
 * Toegevoegde contact kunnen bekijken
 *
 * @author Rona Rieza & Wing Fung Lam
 */

class ContactPageController {

    constructor() {
        this.contactRepository = new ContactRepository();

        $.get("views/contactPage.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    setup(htmlData) {

        this.contactPageView = $(htmlData);

        //Set the name in the view from the session
        this.contactPageView.find(".name").html(sessionManager.get("username"));

        //Update the contact's values
        this.contactPageView.find("#modal-submit").on("click", (event) => this.update(event));

        //delete contact's value from database
        this.contactPageView.find("#del-modal-submit").on("click", (event) => this.delete(event));

        //TODO click event on edit button to fill modal inputfields
        // this.contactPageView.find("#editModal").on("click", (event) => this.fillEditModal(event));

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.contactPageView);

        this.getAll();

    }

    //om alle toegevoegde contacten op te halen
    async getAll() {
        const user_id = sessionManager.get("user_id");

        const contactTable = $("#contacts");
        try {
            const contactData = await this.contactRepository.getAll(user_id);

            for (let i = 0; i < contactData.length; i++) {
                let nextContact = "<tr>";
                nextContact += `<td>${contactData[i].firstname}</td>`;
                nextContact += `<td>${contactData[i].surname}</td>`;
                nextContact += `<td>${contactData[i].address}</td>`;
                nextContact += `<td>${contactData[i].emailaddress}</td>`;
                nextContact += `<td>${contactData[i].phonenumber}</td>`;
                nextContact += `<td>${contactData[i].name}</td>`;
                nextContact += `<td><a class="editButton btn btn-success " data-toggle="modal" data-target="#editModal" 
                                data-contactFName = "${contactData[i].firstname}" 
                                data-contactLName = "${contactData[i].surname}" 
                                data-contactAddres = "${contactData[i].address}" 
                                data-contactNum="${contactData[i].phonenumber}" 
                                data-contactMail="${contactData[i].emailaddress}" 
                                data-contactGroup="${contactData[i].name}" 
                                data-contactid = "${contactData[i].contact_id}" 
                                id="editbutton"  href="">Bewerken</a>
                                <a class="deleteButton btn btn-danger " data-toggle="modal" data-contactid= "${contactData[i].contact_id}" data-target="#deluser_modal" href="#" id="deleteButton">Verwijder</a>
                                </td>`;

                nextContact += "</tr>";

                contactTable.append(nextContact);

                $('.editButton').off().on("click", (event) => {
                    event.preventDefault();
                   console.log("Loading modal");
                    this.contactPageView.find("#inputFirstname").val(event.currentTarget.dataset.contactfname);
                    this.contactPageView.find("#inputSurname").val(event.currentTarget.dataset.contactlname);
                    this.contactPageView.find("#inputPhonenumber").val(event.currentTarget.dataset.contactnum);
                    this.contactPageView.find("#inputEmailaddress").val(event.currentTarget.dataset.contactmail);
                    this.contactPageView.find("#inputAddress").val(event.currentTarget.dataset.contactaddres);
                    this.contactPageView.find("#inputAddress").val(event.currentTarget.dataset.contactgroup);
                    this.contactPageView.find("#inputFirstname").data("contactId", event.currentTarget.dataset.contactid);

                    console.log("Naam "+event.currentTarget.dataset.contactfname);
                });


                $('.deleteButton').on("click", (event) =>{
                    console.log("Delete button called");
                   const contactId = event.currentTarget.dataset.contactid;
                   this.contactPageView.find("#inputFirstname").data("contactId", contactId);
                });

            }
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            contactTable.text(e)
        }
    }

    //TODO LOAD SELECTED ID'S DATA IN FIELDS
    async update(event) {

        console.log("Opslaan");
        event.preventDefault();
        //Verzamelen van form gegevens
        const id = this.contactPageView.find("#inputFirstname").data("contactId");
        const firstname = this.contactPageView.find("#inputFirstname").val();
        const surname = this.contactPageView.find("#inputSurname").val();
        const address = this.contactPageView.find("#inputAddress").val();
        const emailaddress = this.contactPageView.find("#inputEmailaddress").val();
        const phonenumber = this.contactPageView.find("#inputPhonenumber").val();
        const group = this.contactPageView.find("#inputPhonenumber").val();




        //Error strings
        this.firstname = "Voornaam";
        this.surname = "Achternaam";
        this.phonenumber = "Telefoonnummer";
        this.emailaddress = "Emailadres";
        this.address = "Adres";
        this.emptyField = " mag niet leeg zijn";
        this.numberField = " mag alleen cijfers bevatten";
        this.textField = " mag geen cijfers bevatten";
        this.emailField = " moet een @ bevatten";
        const errors = [];

        //Check firstname
        if (firstname.length === 0 || firstname.match(/^\s*$/)) { //empty field
            document.getElementById("inputFirstname").setCustomValidity(this.firstname + this.emptyField);
            errors.push({
                message: this.firstname + this.emptyField
            });
        } else if (firstname.match("[0-9]")) { //number
            document.getElementById("inputFirstname").setCustomValidity(this.firstname + this.textField);
            errors.push({
                message: this.firstname + this.textField
            });
        }

        //Check surname
        if (surname.match("[0-9]")) { //numbers
            document.getElementById("inputSurname").setCustomValidity(this.surname + this.textField);
            errors.push({
                message: this.surname + this.textField
            });
        }

        // Check phonenumber
        if (phonenumber.length === 0 || phonenumber.match(/^\s*$/)) { //empty field
            document.getElementById("inputPhonenumber").setCustomValidity(this.phonenumber + this.emptyField);
            errors.push({
                message: this.phonenumber + this.emptyField
            });
        } else if (phonenumber.match("[^0-9]")) { //not a number
            document.getElementById("inputPhonenumber").setCustomValidity(this.phonenumber + this.numberField);
            errors.push({
                message: this.phonenumber + this.numberField
            });
        }

        // Check emailaddress
        if (emailaddress.length !== 0 && !emailaddress.match("@")) { //not empty and doesn't contain a @
            document.getElementById("inputEmailaddress").setCustomValidity(this.emailaddress + this.emailField);
            errors.push({
                message: this.emailaddress + this.emailField
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
                console.log(`${firstname} - ${surname} - ${phonenumber} - ${emailaddress} - ${address}`);
                const eventId = await this.contactRepository.create(firstname, surname, phonenumber, emailaddress, address, user_id);
                console.log(eventId);
                app.loadController(CONTROLLER_CONTACT_PAGE);
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


    //Delete user
    async delete(event) {
        event.preventDefault();
        const contactid = this.contactPageView.find("#inputFirstname").data("contactId");
        console.log("user delete" + contactid);
        try{
            const userdelete = await this.contactRepository.delete(contactid);
            console.log(userdelete);


        }catch (e) {
            console.log(e);
        }finally {
            setTimeout(function(){
                window.location.reload();
            }, 1000);

            $("#deluser_modal").modal('hide');
        }
    }

}