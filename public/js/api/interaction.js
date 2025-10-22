import apiClient from "./api";

const API_URL = "http://localhost:8080";


export async function likeToggle(postId){
    try {
        const response = await apiClient.post(`${API_URL}/posts/${postId}`);
        return response;
    } catch (error) {
        console.error('좋아요 토글 실패', error);
        throw error;
    }
}
