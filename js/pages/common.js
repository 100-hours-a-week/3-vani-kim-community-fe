// 페이지의 돔이 모두 로드되면 실행합니다.
document.addEventListener("DOMContentLoaded", function() {

    //헤더를 삽입할 위치 탐색
    const headerPlaceholder = document.getElementById('header-placeholder');

    //header.html 파일의 내용 가져오기(/localhost:이런게 숨어 있다.)
    fetch('/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답 망함!');
        }
        //html의 파일은 담을 수 없으니 text로 변환
        return response.text();
    })
    .then(html => {
        // 가져온 내용을 placehoder에 넣기
        headerPlaceholder.innerHTML = html;
    })
    .catch(error => {
        console.error('헤더 로드 실패:', error);
        headerPlaceholder.innerHTML = '<p>헤더 로드 실패</p>'
    })
});

/**
 * 사용자가 선택한 이미지의 미리보기를 띄워주는 메서드
 * */
function initImageUploader() {
    // 이미지 업로더 찾고
    const Uploader = document.querySelector('.image-uploader');

    // 찾은 업로더의 이미지를 사용자가 선택한 이미지와 바꾸기
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.querySelector('.image-preview');

    imageInput.addEventListener('change', e => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}