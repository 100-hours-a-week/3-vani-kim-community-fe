import { getPresignTempUrl, uploadToS3 } from "/js/api/image.js"
import { signup, emailCheck, nicknameCheck } from "/js/api/auth.js";
import { renderImagePreview, isFileSizeValid } from "/js/utils/fileUtils.js";

const signupButton = document.getElementById('signup-button');

let validationState = {
    email: false,
    nickname: false,
    password: false,
    passwordConfirm: false,
}
function checkFormValidity() {
    const allValid = Object.values(validationState).every(status => status === true);
    signupButton.disabled = !allValid;
}
//TODO 원래 이미지가 있었으면 변경 실패하면 그거로 유지 시켜줘야함
// 1. 선택한 이미지 미리보기 및 이미지 크기 검사
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const DEFAULT_AVATAR_IMAGE = 'assets/user.png'
const MAX_PROFILE_SIZE_MB = 10; //10MB

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if(!file) {
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    //크기 검사 로직을 util 함수로 대체
    if (!isFileSizeValid(file,MAX_PROFILE_SIZE_MB)) {
        alert(`파일 크기는 ${MAX_PROFILE_SIZE_MB} MB를 초과할 수 없습니다.`);
        imageInput.value = "";
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    renderImagePreview(file, imagePreview, DEFAULT_AVATAR_IMAGE);
});

//2. 이메일 중복 검증
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
                validationState.email = true;
            } catch (e) {
                emailVerified.textContent = '이미 존재하는 이메일입니다.';
                emailVerified.style.color = 'red';
                emailVerified.style.display = "block";
                validationState.email = false;
            }
        } else {
            emailVerified.textContent = '올바른 이메일 형식이 아닙니다.';
            emailVerified.style.color = 'red';
            emailVerified.style.display = 'block';
            validationState.email = false;
        }
    } else {
        emailVerified.textContent = '';
        emailVerified.style.display = 'none';
        validationState.email = false;
    }
   checkFormValidity();
});


//3.닉네임 중복 검증
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
                validationState.nickname = true;
            } catch (e) {
                nicknameVerified.textContent = '이미 존재하는 닉네임입니다.';
                nicknameVerified.style.color = 'red';
                nicknameVerified.style.display = "block";
                validationState.nickname = false;
            }
        } else {
            nicknameVerified.textContent = '올바른 닉네임형식이 아닙니다.';
            nicknameVerified.style.color = 'red';
            nicknameVerified.style.display = 'block';
            validationState.nickname = false;
        }
    } else {
        nicknameVerified.textContent = '';
        nicknameVerified.style.display = 'none';
        validationState.nickname = false;
    }
    checkFormValidity();
});

//4. 비밀번호 포맷과 재입력확인
const passwordInput = document.getElementById('password')
const passwordVerified = document.getElementById('passwordVerified')
const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !\"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~])[A-Za-z\d !\"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]{8,20}$/
passwordInput.addEventListener('blur', async (e) => {
    const passwordValue = passwordInput.value;
    if (passwordValue) {
        if (passwordRegex.test(passwordValue)) {
            passwordVerified.textContent = '사용 가능한 비밀번호입니다.';
            passwordVerified.style.color = 'green';
            passwordVerified.style.display = 'block';
            validationState.password = true;
        } else {
            passwordVerified.textContent = '올바른 비밀번호형식이 아닙니다. 영어,숫자,특수문자를 하나이상 포함한 8-20자 이상이어야합니다.';
            passwordVerified.style.color = 'red';
            passwordVerified.style.display = 'block';
            validationState.password = false;
        }
    } else {
            passwordVerified.textContent = '';
            passwordVerified.style.display = 'none';
            validationState.password = false;
    }

    passwordConfirmVerified.textContent = '';
    passwordConfirmVerified.style.display = 'none';
    validationState.passwordConfirm = false;

    checkFormValidity();
});

const passwordConfirm = document.getElementById('passwordConfirm')
const passwordConfirmVerified = document.getElementById('passwordConfirmVerified')
passwordConfirm.addEventListener('blur', async (e) => {
    const passwordValue = passwordInput.value;
    const passwordConfirmValue = passwordConfirm.value;
    if (validationState.password && passwordConfirmValue) {
        if (passwordValue === passwordConfirmValue) {
            passwordConfirmVerified.textContent = '비밀번호가 일치합니다.';
            passwordConfirmVerified.style.color = 'green';
            passwordConfirmVerified.style.display = 'block';
            validationState.passwordConfirm = true;
        } else {
            passwordConfirmVerified.textContent = '비밀번호가 일치하지 않습니다.';
            passwordConfirmVerified.style.color = 'red';
            passwordConfirmVerified.style.display = 'block';
            validationState.passwordConfirm = false;
        }
    } else {
        passwordConfirmVerified.textContent = '';
        passwordConfirmVerified.style.display = 'none';
        validationState.passwordConfirm = false;
    }
    checkFormValidity();
});

//5. 회원가입 폼의 동작 감지하기,
document.getElementById('signup').addEventListener('submit', async (event) => {
    event.preventDefault();

    //사용자의 input가져오기
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    const nicknameValue = document.getElementById('nickname').value;

    //입력으로 받은 이미지파일
    // const imageFile = document.getElementById('image-input').files[0];

    //이미지 처리
    let profileImageKey = null;
    if (imageFile) {
        try {
            //서버에 Presigned URL 요청
            const{ presignedUrl, fileUrl, contentType } = await getPresignTempUrl(
                imageFile.name, imageFile.type, imageFile.size);

            //S3에 업로드
            await uploadToS3(presignedUrl, imageFile);

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

