/**
 * 모든 API 요청을 처리하는 중앙 핸들러
 * */
async function apiClient(endpoint, { method = 'GET', body, ...customConfig}){

    //공통 해더 및 토큰 자동 주입
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // fetch 옵션 합치기
    const config = {
        method: method,
        headers: {
            ...headers,
            ...customConfig.headers, // 개별 요청의 헤터도 커스텀가능
        },
        ...customConfig,
    };

    // Json형식의 문자열로 올바르게 변환 axios는 이거 자동으로 해준다.
    if(body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        //HTTP 에러 처리(401, 404...)
        if(!response.ok) {
            if(response.status === 401){
                console.error("인증 만료! 로그아웃 처리")
            }
            const errorData = await response.json();
            //서버가 보낸 에러 메시지 사용
            throw new Error(errorData.message || `HTTP 에러: ${response.status}`);
        }

        // 바디 없는 응답처리
        if(response.status === 204){
            return null;
        }

        // 성공시 응답처리
        return await response.json();
    } catch(error) {
        //네트워크 에러 또는 위에서 throw한 에러
        console.error('API Client Error', error.message);
        throw error;
    }
}
//래퍼함수 기반으로 만든 헬퍼함수
export const api = {
    get: (endpoint) => apiClient(endpoint, {method: 'GET'}),
    post: (endpoint, body) => apiClient(endpoint, {method: 'POST', body}),
    put: (endpoint, body) => apiClient(endpoint, {method: 'PUT', body}),
    delete: (endpoint) => apiClient(endpoint, {method: 'DELETE'}),


}