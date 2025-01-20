import axios from 'axios';

const baseApi = axios.create({
    baseURL: "https://678dc4baa64c82aeb11dde3d.mockapi.io",
    headers: {
        'Content-Type': 'application/json',
    }
})

export default baseApi;