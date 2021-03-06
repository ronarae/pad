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

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.groupPageView);

        this.getAll();
    }

    //om alle toegevoegde contacten op te halen
    async getAll() {
        const user_id = sessionManager.get("user_id");

        try {
            const groupData = await this.groupRepository.getAll(user_id);

            const groupTable = $("#groups");
            for (let i = 0; i < groupData.length; i++) {
                let nextGroup = "<tr>";
                nextGroup += `<td>${groupData[i].name}</td>`;
                nextGroup += `<td><a class="btn btn-success" href="">Edit</a></td>`;
                nextGroup += "</tr>";

                groupTable.append(nextGroup);
            }
        } catch (e) {
            console.log("error while fetching rooms", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            groupData.text(e)
        }
    }

    //Called when the contactPage.html fails to load
    error() {
        $(".content").html("Failed to load content!");
    }

}