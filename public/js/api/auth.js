import apiClient from "./api.js";


//fetchPosts 함수를 만들어서 '수출'하기
//회원가입 요청
export async function signup(email, password, nickname, profileImageKey) {
    try {
        const response = await apiClient.post(`/auth/users`, {
            email,                      // 동일하면 그냥 써도 된다
            password,
            nickname,
            profileImageKey
        });
        return response;
    } catch (error) {
        console.error('회원 가입 실패', error.message);
        throw error;
    }
}

//로그인 요청
export async function login(email, password) {
    try {
        const response = await apiClient.post(`/auth/login`, {
            email,
            password,
        });
        return response;
    } catch (error) {
        console.error('로그인 실패', error.message);
        throw error;
    }
}

//이메일 중복 검증
export async function emailCheck(email) {
    try {
        const response = await apiClient.post(`/auth/email`, {
            email,
        });
        return response;
    } catch (error) {
        console.error('이메일 중복 검증 실패', error.message);
        throw error;
    }
}
//닉네임 중복 검증
export async function nicknameCheck(nickname) {
    try {
        const response = await apiClient.post(`/auth/nickname`, {
            nickname,
        });
        return response;
    } catch (error) {
        console.error('닉네임 중복 검증 실패', error.message);
        throw error;
    }
}