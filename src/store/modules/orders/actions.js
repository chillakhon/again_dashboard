import ordersApi from '@/api/ordersApi.js'

export default {
    namespaced: true,

    state: {
        loadStatus: 0,
        status: {},
        error: null,
    },

    getters: {
        isLoading: state => state.loadStatus,
        status: state => state.status,
        error: state => state.error,
    },

    actions: {

        async deleteOrder ( { commit }, id ){
            commit( 'set_loadStatus', true );
            commit( 'set_status', null );
            commit( 'set_error', null );
            try {
                const response = await ordersApi.delete( id );
                commit( 'set_status', response.data.success );
            } catch ( error ) {
                commit( 'set_error', error.response?.data?.error || 'Deleting Order Failed, Try Again' );
            } finally {
                commit( 'set_loadStatus', false );
            }
        },

    },
    
    mutations: {
        set_loadStatus ( state, loadStatus ){
            state.loadStatus = loadStatus;
        },

        set_status ( state, status ){
            state.status = status;
        },

        set_error ( state, error ){
            state.error = error;
        },
    }
}