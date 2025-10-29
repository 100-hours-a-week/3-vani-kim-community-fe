import { creatPost } from "/js/api/postApi.js";
import { getPresignTempUrl, uploadToS3 } from "/js/api/image.js"
import { renderImagePreview, isFileSizeValid } from "/js/utils/fileUtils.js";


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

// 클릭 이벤트 리스너 추가
// Promise의 반환기다리는 await 쓰려면 async 필수임
// XXX 도메인여러개 쓰면 조심...
document.getElementById('post-form').addEventListener('submit', async (event) => {
    // 폼의 기본 동작 방지하기
    event.preventDefault();

    // JS로 입력 값가져오기
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    //TODO S3 연동해야함+이미지 처리로직
    //입력으로 받은 이미지파일
    const imageFile = document.getElementById('image-input').files[0];

    //이미지 처리
    let postImageKey = null;
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
    //document.getElementById('image').value;
    try {
        const newPost = await creatPost(title, content, postImageKey);

        if (newPost) {
            console.log('게시글 생성 성공');
            alert('게시글 생성 성공');
        }

        //받아온 데이터 보관
        sessionStorage.setItem("tempPost", JSON.stringify(newPost));
        window.location.href = `/post/${newPost.postId}`;

    } catch (error) {
        console.log(error);
        alert('게시글 생성에 실패하였습니다.')
    }
});

