import axios from 'axios';
import {EventModel} from "./types.ts";
import {createEventModelFormData} from "./createFormDatas.ts";

const baseUrl = 'https://api-staging.lexpulse.app'; // Replace with your actual base URL

const getConfig = () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
        headers: {
            authorization: `Bearer ${token}`
        },
    };
};

export const getEvents = async (id:string) => {
    try {
        const response = await axios.get(`${baseUrl}/api/v1/events/user/${id}`, {
            ...getConfig()
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            localStorage.removeItem('token'); // Clear token from localStorage
        }
        throw error;
    }
};

export const getEvent = async (id: string) => {
    try {
        const response = await axios.get(`${baseUrl}/api/v1/events/${id}`, getConfig());
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            localStorage.removeItem('token'); // Clear token from localStorage
        }
        throw error;
    }
};

export const addEvent = async (event: EventModel) => {
    try {
        const completedEvent = await createEventModelFormData(event);
        console.log(completedEvent);
        const response = await axios.post(`${baseUrl}/api/v1/events`, completedEvent, getConfig());
        return response;
    }  catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            localStorage.removeItem('token'); // Clear token from localStorage
        }
        throw error;
    }
};

export const updateEvent = async (id: string, eventData: Partial<EventModel>) => {
    try {
        const response = await axios.patch(`${baseUrl}/api/v1/events/${id}`, eventData, getConfig());
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            localStorage.removeItem('token'); // Clear token from localStorage
        }
        throw error;
    }
};

export const deleteEvent = async (id: string) => {
    try {
        const response = await axios.delete(`${baseUrl}/api/v1/events/${id}`, getConfig());
        return response;
    }  catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            localStorage.removeItem('token'); // Clear token from localStorage
        }
        throw error;
    }
};