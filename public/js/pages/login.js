import { login } from "/js/api/auth.js";

// 클릭 이벤트 리스너 추가
// Promise의 반환기다리는 await 쓰려면 async 필수임
document.getElementById('login-form').addEventListener('submit', async (event) => {
    // 폼의 기본 동작 방지하기
    event.preventDefault();

    // JS로 입력 값가져오기
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;

    try {
        // login 함수 반환 대기
        const tokens = await login(emailValue, passwordValue);
        const currentUser = tokens.nickname;
        // 각각 다른 이름(키)로 localStorage에 저장
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        sessionStorage.setItem("currentUser", currentUser );
        console.log('토큰 저장 성공');

        alert('로그인 성공');
        window.location.href = '/index.html'; //토큰 발급도 끝났으니 바로 메인이동
    
    } catch (error) {
        console.log(error);
        alert('이메일 또는 비밀번호 오류')
    }
});

