// import axios from "axios";
const API_URL = "http://localhost:8080";
//axios 인스턴스 생성
//응답대기 5초
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,

    withCredentials: true // 쿠키 보낼 수 있도록
});

//응답 인터셉터
apiClient.interceptors.response.use(
    //성공적인 응답
    //204 같은건 자동처리
    (response) => {
        console.log('Axios 성공:', response.status);
        return response.data;
    },
    //실패한 응답
    async (error) => {

        if (error.response) {
            const errorData = error.response.data;
            const status = error.response.status;

            if (status === 401 && errorData) {
                if(errorData.code === 'S001') {
                    console.log("세션 만료, 재로그인 필요");
                    if(window.location.pathname !== '/login') {
                        window.location.href ="/login"
                    }
                    return new Promise(() => {});
                }
                else if(errorData.code === 'S002') {
                    console.log("올바르지 않은 세션 아이디, 재로그인 필요");
                    if (window.location.pathname !== '/login') {
                        window.location.href = "/login"
                    }
                    return new Promise(() => {});
                }
            }
            console.error('Axios 실패 (응답 받음):', status, errorData);
        } else {
            console.error('Axios 실패 (응답 없음):', error.message);
        }
        //401말고 다른 오류는 그대로 전파
        return Promise.reject(error);
    }
);

export default apiClient;