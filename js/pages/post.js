import { getPost } from "../api/posts";
import { updatePost } from "../api/posts";
import { deletePost } from "../api/posts";

//URL에서 게시글 아이디 가져오기
const postId = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", function() {})

const data = getPost(postId);
rederPost(data);



document.addEventListener("DOMContentLoaded", function (){
    const currentLoggedInUserID="postAuthorID";

    const postArticle = document.querySelector(".post");
    if (currentLoggedInUserID === postArticle.dataset.authorId) {
        postArticle.querySelector('.post-actions').style.display = 'inline-block';
    }
    //TODO 댓글 actions처리하기
})

//TODO
function toggleMenu(buttonElement) {
    const menu = buttonElement.nextElementSibling;
    menu.classList.toggle("active");
}

//렌더링 시작
function renderPost(post) {
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-author-id").textContent = post.authorNickname;
    document.getElementById("post-author-link").href = `/user/${post.authorId}`;

    const postDate = document.getElementById("post-date");
    // 보여줄 시간
    postDate.textContent = new Date(post.createdAt).toLocaleDateString();
    // 검색엔진 등에 노출되는 기계가 보는 시간
    postDate.dateTime = post.createdAt;

    const postImg = document.getElementById('post-img');
    postImg.src = post.imageUrl;
    postImg.alt = post.title;

    document.getElementById("psot-body").textContent = post.content;

    document.getElementById('post-likes').textContent = `좋아요수 ${post.likes}`
    document.getElementById('post-views').textContent = `조회수 ${post.views}`
    document.getElementById('post-comments').textContent = `댓글수 ${post.comments}`

    //작성자 권한 탐색, 수정/삭제 버튼 생성
    setupPostActionListeners(post)
}

/**
 * 게시글의 액션(수정삭제)를 DOM으로 동적으로 생성하는 메서드
 * 권한을 가진사람에게만 보여야하므로 권한 확인후 생성
 * */
function setupPostActionListeners(post) {
    const postActions = document.getElementById("post-actions");
    if(post.authorId === CURRENT_USER_ID) {
        //DOM API로 버튼 색성하기
        //innerHTML은 간단하지만 리스키함
        const editlink = document.createElement("a");
        editlink.href = `/posts/${post.id}`;
        editLink.className = 'button';
        editLink.textContent = '수정;';

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent ='삭제';

        //JS 에서 직접 이벤트 리스너 연결
        //페이지 처음 로드할때는 없었으니까
        deleteBtn.addEventListener('click', () =>{
            checkPostDelete(post.id);
        })

    }
}

function checkPostDelete(postId) {

    const isConfirmed = confirm("게시글을 삭제하시겠습니까?₩n₩n삭제한 게시글은 복구할 수 없습니다.");
    if (isConfirmed) {
        deletePost();
    } else {
        console.log("삭제 취소")
    }
}

function handleCommentClick(event) {

}
//작성자에게만 수정, 삭제 표시
function renderPostActions(post) {
    const currentUserId = getCurrentUserId();

}