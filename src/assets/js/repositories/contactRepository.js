class ContactRepository {
    constructor() {
        this.route = "/contact";
    }

    async create(firstname, surname, phonenumber, emailaddress, address, user_id) {
        return await networkManager
            .doRequest(this.route, {
                firstname: firstname,
                surname: surname,
                phonenumber: phonenumber,
                emailaddress: emailaddress,
                address: address,
                user_id: user_id
            });
    }

    // async getAll(user_id) {
    //     return await networkManager
    //         .doRequest(`${this.route}s`, {user_id: user_id});
    // }

    async getAll(user_id) {
        return await networkManager
            .doRequest("/contactPage", {user_id: user_id});
    }
}

