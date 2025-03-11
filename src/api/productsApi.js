import axios from 'axios'

class productsApi{
    
    getProducts(query) {
        return axios.get( "/products", { params: query });
    }
    
    create(data) {
        return axios.post("products", data);
    }

    delete(id) {
        return axios.delete("products/" + id);
    }
    
}

export default new productsApi();