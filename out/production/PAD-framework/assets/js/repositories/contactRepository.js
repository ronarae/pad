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

    async getAll(user_id) {
        return await networkManager
            .doRequest("/contactPage", {user_id: user_id});
    }

    async update(firstname, surname, address, emailaddress, phonenumber,id){
        return await networkManager
            .doRequest("/contactPage/update", {
                firstname: firstname,
                surname: surname,
                phonenumber: phonenumber,
                emailaddress: emailaddress,
                address: address,
                id: id
            });
    }

    async delete(contact_id){
        return await networkManager
            .doRequest("/contactPage/delete", {
                contact_id: contact_id
            });
    }
}

