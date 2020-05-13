class GroupRepository {
    constructor() {
        this.route = "/group";
    }

    async create(name, user_id){
        return await networkManager
            .doRequest(this.route, {name: name, user_id: user_id} );

    }

    async getAll(user_id) {
        return await networkManager
            .doRequest("/groupPage", {user_id: user_id});
    }

    async delete(groupId){
        return await networkManager
            .doRequest("/groupPage/delete", {groupId: groupId});
    }

    //to be fixed -rona
    async update(groupId, groupName){
        return await networkManager
            .doRequest("/groupPage/update", {
                groupId: groupId,
                groupName: groupName,
               });




    }

}