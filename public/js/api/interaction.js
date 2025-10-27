import apiClient from "/js/api/api.js";

const API_URL = "http://localhost:8080";


export async function like(postId){
    try {
        const response = await apiClient.post(`${API_URL}/post/${postId}/likes`, {
            params: {
                postId
            }
        })
        return response;
    } catch (error) {
        console.error('좋아요 토글 실패', error);
        throw error;
    }
}
