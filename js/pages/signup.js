import { signup } from "../api/auth.js";
import { getAnonymousPresignedUrl, uploadToS3 } from "../utils/image.js"

//회원가입 폼의 동작 감지하기,
document.getElementById('signup').addEventListener('submit', async (event) => {
    event.preventDefault();

    //사용자의 input가져오기
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    const nicknameValue = document.getElementById('nickname').value;

    //입력으로 받은 이미지파일
    const imageFile = document.getElementById('image-input').files[0];

    //이미지 처리
    let profileImageKey = null;
    if (imageFile) {
        try {
            //서버에 Presigned URL 요청
            const{ presignedUrl, presignedKey } = await getAnonymousPresignedUrl(
                imageFile.name, imageFile.type, imageFile.size);

            //S3에 업로드
            await uploadToS3(presignedUrl, presignedKey, imageFile);

            profileImageKey = presignedKey;

        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 오류, 다시 시도해 주세요.');
            return; // 회원가입 중단
        }
    }

    try {
        const signupData = await signup(emailValue, passwordValue, nicknameValue, profileImageKey);

        //캐싱
        localStorage.setItem('accessToken', signupData.accessToken);
        localStorage.setItem('refreshToken', signupData.refreshToken);

        // 페이지 이동
        alert('회원가입 성공');
        window.location.href = '/login.html'; //토큰 발급도 끝났으니 바로 메인이동
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다.');
    }
});

