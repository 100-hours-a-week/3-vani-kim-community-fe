import apiClient from "/js/api/api.js";

const API_URL = "http://localhost:8080";

export async function getPosts(cursorId, cursorCreatedAt, size){
    try {
        const response = await apiClient.get(`${API_URL}/posts`, {
            //null이면 포함 안시킴
            params: {
                cursorId,
                cursorCreatedAt,
                size
            }
        });
        return response;
    } catch (error) {
        console.error('게시글 목록 조회 실패', error);
        throw error;
    }
}


export async function getPost(postId){
    try {
        const response = await apiClient.get(`${API_URL}/posts/${postId}`);
        return response;
    } catch (error) {
        console.error('게시글 조회 실패', error);
        throw error;
    }
}


export async function creatPost(title, content, postImageKey){
    try {
        const response = await apiClient.post(`${API_URL}/posts`, {
            title,
            content,
            postImageKey
        });
        return response;
    } catch (error) {
        console.error('게시글 생성 실패', error);
        throw error;
    }
}

export async function updatePost(postId, title, content, postImageKey){
    try {
        const response = await apiClient.patch(`${API_URL}/posts/${postId}`, {
            title,
            content,
            postImageKey
        });
        return response;
    } catch (error) {
        console.error('게시글 수정 실패', error);
        throw error;
    }
}


export async function deletePost(postId){
    try {
        const response = await apiClient.delete(`${API_URL}/posts/${postId}`);
        return response;
    } catch (error) {
        console.error('게시글 삭제 실패', error);
        throw error;
    }
}
