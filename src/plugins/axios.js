import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

export default {
    axios
}