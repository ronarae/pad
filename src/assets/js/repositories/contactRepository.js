class ContactRepository {
    constructor() {
        this.route = "/contact";
    }

    async create(firstname, surname, phonenumber, emailaddress, address, group_id, user_id) {
        return await networkManager
            .doRequest(this.route, {
                firstname: firstname,
                surname: surname,
                address: address,
                phonenumber: phonenumber,
                emailaddress: emailaddress,
                group: group_id,
                user_id: user_id
            });
    }

    async getAll(user_id) {
        return await networkManager
            .doRequest("/contactPage", {user_id: user_id});
    }

    async update(firstname, surname, address, emailaddress, phonenumber, group, id){
        return await networkManager
            .doRequest("/contactPage/update", {
                firstname: firstname,
                surname: surname,
                address: address,
                emailaddress: emailaddress,
                phonenumber: phonenumber,
                group: group,
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

