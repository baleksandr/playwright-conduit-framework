import axios from 'axios';

export const CreateApiClient = (token: string) => {
    return axios.create({
        baseURL: 'https://conduit-api.bondaracademy.com/api',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` // 🔥 Один раз прописали тут
        }
    });
} 
