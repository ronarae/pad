class GroupRepository {
    constructor() {
        this.route = "/group";
    }

    async create(name, user_id){
        return await networkManager
            .doRequest(this.route, {name: name, user_id: user_id} );

    }

    async getUngroup(user_id){
        return await networkManager
            .doRequest("/groupPage/ungroup", {user_id: user_id});
    }

    async getAll(user_id) {
        return await networkManager
            .doRequest("/groupPage", {user_id: user_id});
    }

    async getGroupContact(group_id){
        return await networkManager
            .doRequest("/groupPage/getCon", {group_id:group_id});
    }

    async getAllContact(user_id){
        return await networkManager
            .doRequest("/group/get", {user_id: user_id});
    }


    async removeContact(contact_id){
        return await networkManager
            .doRequest("/group/remove",{contact_id: contact_id});
    }

    async contactAdd(group_id, contact_id){
        return await networkManager
            .doRequest("/group/update", {group_id: group_id, contact_id: contact_id,});
    }

    async delete(groupId){
        return await networkManager
            .doRequest("/groupPage/delete", {groupId: groupId});
    }

    async update(groupId, groupName){
        return await networkManager
            .doRequest("/groupPage/update", {
                groupId: groupId,
                groupName: groupName,
               });

    }

}