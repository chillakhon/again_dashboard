import axios from 'axios'

class clientsApi{
    
    getOrders() {
        return axios.get("/orders");
    }

    getOrder(id) {
        return axios.get("/orders/" + id);
    }
    
    create(data) {
        return axios.post("/orders", data);
    }

    update(id, data) {
        return axios.put("/orders/" + id, data);
    }

    delete(id) {
        return axios.delete("/orders/" + id);
    }
    
}

export default new clientsApi();