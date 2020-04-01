/**
 * ContactPage Controller
 * Toegevoegde contact kunnen bekijken
 *
 * @author Rona Rieza
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
                nextContact += `<td><a class="btn btn-success" href="">Edit</a></td>`;
                nextContact += "</tr>";

                contactTable.append(nextContact);
            }
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            contactData.text(e)
        }
    }

    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}