import apiClient from "/js/api/api.js";
const API_URL = "http://localhost:8080";


export async function getUser() {
    try {
        const response = await apiClient.get(`${API_URL}/users/me`);
        return response;
    } catch (error) {
        console.error('유저 조회 실패', error.message);
        throw error;
    }
}

export async function updateUser(nickname, profileImageKey) {
    try {
        const response = await apiClient.patch(`${API_URL}/user/me`, {
            nickname,
            profileImageKey
        });
        return response;
    } catch (error) {
        console.error('유저 정보 수정 실패', error.message);
        throw error;
    }
}

export async function withdrawUser(password) {
    try {
        const response = await apiClient.patch(`${API_URL}/user/me`, {
            password
        });
        return response;
    } catch (error) {
        console.error('유저 탈퇴 실패', error.message);
        throw error;
    }
}

export async function updatePassword(password) {
    try {
        const response = await apiClient.patch(`${API_URL}/user/me`, {
            password
        });
        return response;
    } catch (error) {
        console.error('비밀번호 변경 실패', error.message);
        throw error;
    }
}