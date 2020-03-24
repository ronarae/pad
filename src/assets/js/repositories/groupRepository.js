class GroupRepository {
    constructor() {
        this.route = "/group";
    }

    async create(name){
        return await networkManager
            .doRequest(this.route, {name: name, userId: 1} );

    }

}