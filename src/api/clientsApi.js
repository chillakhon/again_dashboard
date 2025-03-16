import axios from 'axios'

class clientsApi{
    
    getClients(query) {
        return axios.get("/clients", { params: query });
    }

    getClient(id) {
        return axios.get("/clients/" + id);
    }
    
    create(data) {
        return axios.post("clients", data);
    }

    delete(id) {
        return axios.delete("clients/" + id);
    }
    
}

export default new clientsApi();