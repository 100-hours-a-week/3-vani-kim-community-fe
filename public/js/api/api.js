//import axios from "axios";
const API_URL = "http://localhost:8080";
//axios 인스턴스 생성
//응답대기 5초
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

//요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        config.headers['Content-Type'] = 'application/json';

        return config;
    },
    (error) => {
        console.log('Request Interceptor Error: ',error);
        return Promise.reject(error);
    }
)

//응답 인터셉터
//TODO 토큰 갱신안되는데 확인 필요함...

apiClient.interceptors.response.use(
    //성공적인 응답
    //204 같은건 자동처리
    (response) => {
        console.log('Axios 성공:', response.status);
        return response.data;
    },
    //실패한 응답
    async (error) => {
        const originalRequest = error.config;
        const errorData = error.response.data;

        // 401이고 에러데이터 있는지(토큰 오류 확인용)
        if (error.response.status === 401 && errorData && !originalRequest._isRetry) {

            if (errorData.code === 'T001') {
                console.log("토큰 민료, 갱신 시도");
                originalRequest._isRetry = true; // 무한 재시도 방지

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken: refreshToken,
                    });

                    const newAccessToken = response.data.accessToken;
                    const newRefreshToken = response.data.refreshToken;
                    localStorage.setItem("refreshToken", newRefreshToken);
                    localStorage.setItem("accessToken", newAccessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // 갱신도 못했으면 로그아웃
                    console.error("토큰 갱신 실패", refreshError);
                    // window.location.href = "/login"; //API 통신 모듈이 하기에 적절하지 않음
                    return Promise.reject(refreshError);
                }
            }

            else if(errorData.code === 'T002' || errorData.code === 'T003') {
                console.error("유효하지 않으 토큰, 강제 로그아웃", errorData.message);
                // window.location.href = "/login";
            }
        }
        console.error('Axios 실패:', error.response.status, error.response.data);

        //공통 에러 메시지나, 로그 남기기가능
        return Promise.reject(error);
    }
);
export default apiClient;