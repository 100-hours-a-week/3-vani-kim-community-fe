import { renderPost, setupPostActionListeners } from '/js/pages/post.js'
import { getPost, getPosts} from "/js/api/postApi.js";
import { createComment, getComments } from "/js/api/comments.js";
import { handleCommentClick, renderComment, setupCommentForm } from "/js/pages/comment.js";

document.addEventListener("DOMContentLoaded", function (){

    const currentLoggedInUserID="postAuthorID";

    const postArticle = document.querySelector(".post");
    if (currentLoggedInUserID === postArticle.dataset.authorId) {
        postArticle.querySelector('.post-actions').style.display = 'inline-block';
    }
})
//URL에서 게시글 아이디 가져오기
const path = window.location.pathname;
const parts = path.split('/');
const postId = parts.pop()
//메인로직
//게시글을 상세 조회하는 메서드
async function initPage() {
    try {
        let post;
        let commentData;
         //세션확인
        const tempPostData = sessionStorage.getItem("tempPost");
        if (tempPostData) {
            const tempPost = JSON.parse(tempPostData);
            if(tempPost.postId === postId) {
                console.log('세션데이터 이용');
                post = tempPost;
                sessionStorage.removeItem("tempPost");
                commentData = {items : [] }
            }
        }
        if (!post) {
            console.log("API 호출 (Promise.all)");
            [post, commentData] = await Promise.all([
                getPost(postId),
                getComments(postId)
            ]);
        }

        renderPost(post);

        const commentListContainer = document.getElementById('comment-list');

        const fragment = new DocumentFragment();

        const commentArray = commentData.items;

        commentArray.forEach(comment => {
            const commentElement = renderComment(comment);
            fragment.appendChild(commentElement);
        });

        commentListContainer.appendChild(fragment);
        // 댓글 목록(ul)에 이벤트 리스너 1개 추가
        //괄호 빼고 함수 자체 넘기면 이벤트 발생시 이벤트 객체 넘겨서 함수 호출
        commentListContainer.addEventListener('click', handleCommentClick);

        setupCommentForm(postId);
    } catch (err) {
        console.error("페이지 로딩 실패:", err);
        document.getElementById("comment-list").innerHTML = "<p>댓글 목록을 불러오는데 실패했습니다.</p>";
    }
}

initPage();