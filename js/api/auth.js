const API_URL = "http://localhost:8080";

//fetchPosts 함수를 만들어서 '수출'하기
export async function signup(email, password, nickname, profileImageKey) {
    const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            nickname: nickname,
            imageKey: profileImageKey
        })
    });
    return response.json()
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/tokens`, {
        method: 'POST',
        //mode: 'cors', 아직 설정 안함
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}` //없으면?
        },

        body: JSON.stringify({
            "email" : email,
            "password": password,
        }) // 로그인 시 입력된 값들 받아야함
    });
    if (response.ok) {
        console.log(response);
    } else {
        console.error(response);
    }
}