import { creatPost } from "/js/api/postApi.js";

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
    const postImageKey = null
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

