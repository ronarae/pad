class contactRepository {
    constructor() {
        this.route = "/contact";
    }

    async create(firstname, surname, phonenumber, emailaddress, address) {
        return await networkManager
            .doRequest(this.route, {
                firstname: firstname,
                surname: surname,
                phonenumber: phonenumber,
                emailaddress: emailaddress,
                address: address
            });
    }
}