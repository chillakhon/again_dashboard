import axios from 'axios'

class productsApi{
    
    getProducts(query) {
        return axios.get("/products", { params: query });
    }

    getProduct(id) {
        return axios.get("/products/" + id);
    }
    
    create(data) {
        return axios.post("products", data);
    }

    delete(id) {
        return axios.delete("products/" + id);
    }
    
}

export default new productsApi();