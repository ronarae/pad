class ContactPageRepository {
    constructor() {
        this.route = "/contactPage"
    }

    async get(roomId) {
        return await networkManager
            .doRequest(this.route, {id: roomId});
    }
}