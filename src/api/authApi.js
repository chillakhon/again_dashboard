import axios from 'axios'

class authApi{
    signIn( credentials ) {
        return axios.post( "/login", credentials );
    }

    getUserInfo(){
        return axios.get ( "/user" );
    }

    // postSignOut() {
    //     return axios.post ( "auth/logout" );
    // }
}

export default new authApi();