import {getUser, withdrawUser, updateUser, updatePassword} from "/js/api/user.js";
import {nicknameCheck} from "/js/api/auth.js";

document.addEventListener("DOMContentLoaded", async function (){
    const user = await getUser();
// TODO 이미지 처리
    document.getElementById("email").value = "email"
    document.getElementById("nickname").value = user.nickname;
});

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
                nicknameVerified.style.display = "block";
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