import { getAnonymousPresignedUrl, uploadToS3 } from "/js/utils/image.js"
import { signup, emailCheck, nicknameCheck } from "/js/api/auth.js";

const emailInput = document.getElementById('email')
const emailVerified = document.getElementById('emailVerified')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener('blur', async (e) => {
    const emailValue = emailInput.value;

    if (emailValue) {

        if (emailRegex.test(emailValue)) {
            try{
                await emailCheck(emailValue);
                emailVerified.textContent = '사용 가능한 이메일입니다.';
                emailVerified.style.color = 'green';
                emailVerified.style.display = 'block';
            } catch (e) {
                emailVerified.textContent = '이미 존재하는 이메일입니다.';
                emailVerified.style.color = 'red';
                emailVerified.style.display = "block";
            }
        } else {
            emailVerified.textContent = '올바른 이메일 형식이 아닙니다.';
            emailVerified.style.color = 'red';
            emailVerified.style.display = 'block';
        }
    } else {
        emailVerified.textContent = '';
        emailVerified.style.display = 'none';
    }
})

const nicknameInput = document.getElementById('nickname')
const nicknameVerified = document.getElementById('nicknameVerified')
const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

nicknameInput.addEventListener('blur', async (e) => {
    const nicknameValue = nicknameInput.value;
    if (nicknameValue) {

        if (nicknameRegex.test(nicknameValue)) {
            try{
                await nicknameCheck(nicknameValue);
                nicknameVerified.textContent = '사용 가능한 닉네임입니다.';
                nicknameVerified.style.color = 'green';
                nicknameVerified.style.display = 'block';
            } catch (e) {
                nicknameVerified.textContent = '이미 존재하는 닉네임입니다.';
                nicknameVerified.style.color = 'red';
                nicknamelVerified.style.display = "block";
            }
        } else {
            nicknameVerified.textContent = '올바른 닉네임형식이 아닙니다.';
            nicknameVerified.style.color = 'red';
            nicknameVerified.style.display = 'block';
        }
    } else {
        nicknameVerified.textContent = '';
        nicknameVerified.style.display = 'none';
    }
})
//TODO 비밀번호 포멧확인

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
    //TODO 회원가입 성공 토큰 제거 고민
    try {
        const signupData = await signup(emailValue, passwordValue, nicknameValue, profileImageKey);

        //캐싱
        localStorage.setItem('accessToken', signupData.accessToken);
        localStorage.setItem('refreshToken', signupData.refreshToken);

        // 페이지 이동
        alert('회원가입 성공');
        window.location.href = '/index'; //토큰 발급도 끝났으니 바로 메인이동하는게 좋지 않나?
    } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다.');
    }
});

