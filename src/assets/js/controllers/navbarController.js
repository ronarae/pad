/**
 * Responsible for handling the actions happening on sidebar view
 *
 * @author Lennard Fonteijn, Pim Meijer
 */
class NavbarController {
    constructor() {
        $.get("views/navbar.html")
            .done((htmlData) => this.setup(htmlData))
            .fail(() => this.error());
    }

    //Called when the navbar.html has been loaded
    setup(htmlData) {
        //Load the sidebar-content into memory
        this.sidebarView = $(htmlData);

        //Find all anchors and register the click-event
        this.sidebarView.find("a").on("click", this.handleClickMenuItem);


        //show user's name
        this.sidebarView.find(".name").append(sessionManager.get("username"));

        //When valid user is logged in, remove login option
        if(sessionManager.get("username")){
            console.log("navbar logic")
            this.handleNavLogin();
        }else{
            this.handleNavLogout();
        }



        //Empty the sidebar-div and add the resulting view to the page
        $(".sidebar").empty().append(this.sidebarView);
    }

    handleNavLogout(){
        this.sidebarView.find(".name").hide();
        this.sidebarView.find("a[data-controller$='logout']").hide();
        this.sidebarView.find("a[data-controller$='contacts']").hide();
        this.sidebarView.find("a[data-controller$='contactPage']").hide();
        this.sidebarView.find("a[data-controller$='group']").hide();
        this.sidebarView.find("a[data-controller$='groupPage']").hide();

       this.sidebarView.find("a[data-controller$='login']").show();
       this.sidebarView.find("a[data-controller$='register']").show();
    }

    handleNavLogin(){
        this.sidebarView.find("a[data-controller$='login']").hide();
        this.sidebarView.find("a[data-controller$='register']").hide();

        this.sidebarView.find(".name").show();
        this.sidebarView.find("a[data-controller$='logout']").show();
        this.sidebarView.find("a[data-controller$='contacts']").show();
        this.sidebarView.find("a[data-controller$='contactPage']").show();
        this.sidebarView.find("a[data-controller$='group']").show();
        this.sidebarView.find("a[data-controller$='groupPage']").show();

    }

    handleClickMenuItem() {
        //Get the data-controller from the clicked element (this)
        const controller = $(this).attr("data-controller");

        //Pass the action to a new function for further processing
        app.loadController(controller);

        //Return false to prevent reloading the page
        return false;
    }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load the navbar!");
    }



}
