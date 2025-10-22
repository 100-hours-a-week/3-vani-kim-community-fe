import { renderPost, setupPostActionListeners } from './post.js'
import {getPost, getPosts} from "../api/postApi";
import {getComments} from "../api/comments";

//URL에서 게시글 아이디 가져오기
const postId = new URLSearchParams(window.location.search).get("id");

//메인로직
async function initPage() {
    try {

        let post;
        let comments;
         //세션확인
        const tempPostData = sessionStorage.getItem("tempPost");
        if (tempPostData) {
            const tempPost =JSON.parse(tempPostData);
            if(tempPost.id === postId) {
                console.log('세션데이터 이용');
                post = tempPost;
                sessionStorage.removeItem("tempPost");
                comments = []
            }
        }
        if (!post) {
            console.log("API 호출 (Promise.all)");
            [post, comments] = await Promise.all([
                getPost(postId),
                getComments(postId)
            ]);
        }
        post.comments = comments; // 댓글 개수 용
        renderPost(post);

        const commentListContainer = document.getElementById('comment-list');

        const fragment = new DocumentFragment();

        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            fragment.appendChild(commentElement);
        });

        commentListContainer.appendChild(fragment);
        // 댓글 목록(ul)에 이벤트 리스너 1개 추가
        commentListContainer.addEventListener('click', handleCommentClick);
    } catch (err) {
        console.error("페이지 로딩 실패:", err);
        document.getElementById("comment-list").innerHTML = "<p>게시글을 불러오는데 실패했습니다.</p>";
    }
}

initPage();