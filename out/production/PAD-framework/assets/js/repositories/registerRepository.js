class registerRepository {
    constructor() {
        this.route = "/register";
    }

    async create(username, emailaddress, password) {
        return await networkManager
            .doRequest(this.route, {
                username: username,
                emailaddress: emailaddress,
                password: password
            });
    }

}