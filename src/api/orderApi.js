import axios from 'axios'

class clientsApi{
    
    getOrders(query) {
        return axios.get("/orders", { params: query });
    }

    getOrder(id) {
        return axios.get("/orders/" + id);
    }
    
    create(data) {
        return axios.post("orders", data);
    }

    update(data) {
        return axios.put("/orders/" + id);
    }

    delete(id) {
        return axios.delete("orders/" + id);
    }
    
}

export default new clientsApi();