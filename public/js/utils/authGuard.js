(function() {
    // 로컬 스토리지 토큰확인
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        alert('로그인이 필요한 페이지 입니다.');

        //로그인 페이지 리디렉션
        window.location.href = `/login?redirect=${window.location.pathname}`;
    }
}) ();
//(IIFE (즉시 실행 함수) 로 감싸서 변수 충동을 방지
