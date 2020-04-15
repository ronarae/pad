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
        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.contactPageView);

        this.getAll();
    }

    //om alle toegevoegde contacten op te halen
    async getAll() {
        const user_id = sessionManager.get("user_id");

        try {
            const contactData = await this.contactRepository.getAll(user_id);

            const contactTable = $("#contacts");
            for (let i = 0; i < contactData.length; i++) {
                let nextContact = "<tr>";
                nextContact += `<td>${contactData[i].firstname}</td>`;
                nextContact += `<td>${contactData[i].surname}</td>`;
                nextContact += `<td>${contactData[i].address}</td>`;
                nextContact += `<td>${contactData[i].emailaddress}</td>`;
                nextContact += `<td>${contactData[i].phonenumber}</td>`;
                nextContact += `<td><a class="btn btn-success" data-toggle="modal" data-target="#editModal" id="editbutton"  href="">Edit</a>
                                <a class="btn btn-danger" data-toggle="modal" data-target="#deluser_modal" href="#">Delete</a>
                                 <input type="hidden" id="contact_id" value="${contactData[i].contact_id}"
                                </td>`;

                nextContact += "</tr>";

                contactTable.append(nextContact);

            }
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            contactData.text(e)
        }
    }

    //TODO LOAD SELECTED ID'S DATA IN FIELDS
    async update(event) {

        console.log("Opslaan");
        event.preventDefault();
        //Verzamelen van form gegevens
        const id = this.contactPageView.find("#contact_id").val();
        const firstname = this.contactPageView.find("#inputFirstname").val();
        const surname = this.contactPageView.find("#inputSurname").val();
        const phonenumber = this.contactPageView.find("#inputPhonenumber").val();
        const emailaddress = this.contactPageView.find("#inputEmailaddress").val();
        const address = this.contactPageView.find("#inputAddress").val();
        console.log("input: "+ id, firstname,surname, phonenumber, emailaddress, address);
        try {
            const userUpdate = await this.contactRepository.update(firstname,surname, phonenumber, emailaddress, address, id);
            console.log(userUpdate);

        } catch (e) {
            console.log(e);
        }
    }

    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }


    //Delete user
    async delete(event) {
        console.log("delete user")
        event.preventDefault();
        const id = this.contactPageView.find("#contact_id").val();
        console.log("user " + id);
        try{
            const userdelete = await this.contactRepository.delete(id);
            console.log(userdelete);
        }catch (e) {
            console.log(e);
        }
    }

}