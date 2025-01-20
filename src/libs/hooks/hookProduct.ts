import baseApi from "../baseApi/baseApi";
import { Product } from "../type";

export const getProducts = async() => {
    try {
        const response = await baseApi.get('/commerce');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getProductById = async(id: string) => {
    try {
        const response = await baseApi.get(`/commerce/${id}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const createProduct = async(data: Product) => {
    try {
        const response = await baseApi.post('/commerce', data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const updateProduct = async(id: string, data: Product) => {
    try {
        const response = await baseApi.put(`/commerce/${id}`, data);
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const deleteProduct = async(id: string) => {
    try {
        const response = await baseApi.delete(`/commerce/${id}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
}