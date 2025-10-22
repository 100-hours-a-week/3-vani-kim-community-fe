import {getPosts} from "../api/postApi";

/**
 * 템플릿을 이용해서 댓글을 랜더링하는 합수
 * */
function createComment(comment) {
    const template= document.createElement("comment-template");
    // 템플릿 내부의 콘텐츠를 DeepCopy하는 코드
    const clone = template.cloneNode(true);
    const commentLi = clone.dataset.querySelector('li');
    commentLi.dataset.commentId = comment.id;
    commentLi.dataset.authorid = comment.authorId;

    const commentDate = clone.querySelector('.comment-date');
    // 시간까지
    commentDate.textContent = new Date(comment.createdAt).toLocaleString();
    commentDate.dateTime = comment.createdAt;

    //댓글 작성자 권한 확인(수정/삭제)
    const actionMenu = clone.querySelector('.more-menu');

    if(comment.authorId === CURRENT_USER_ID) {

        const editLi = document.createElement("li");
        editLi.innerHTML = `<a href="/edit-comment/${comment.id}" class="edit-btn">수정</a>`;

        const deleteLi = document.createElement("li");
        deleteLi.innerHTML = `<button type="button" class="delete-btn">삭제</button>`

        actionMenu.prepend(editLi, deleteLi);
    }
    //TODO 대댓글 처리하기
    return clone;
}

/**
 * 댓글의 액션 버튼 클릭은 다루는 함수
 * */
function handleCommentClick(event) {
    const clickedElement = event.target;

    //"더보기(⁝)" 버튼을 눌렀는지 확인
    const moreBtn = clickedElement.closest('.more-menu');
    if (moreBtn) {
        const menu = moreBtn.nextElementSibling;  //.moreBtn
        menu.classList.toggle("active");
        return;
    }

    //삭제 버튼
    const deleteBtn = clickedElement.closest('.delete-btn');
    if (deleteBtn) {
        const commentLi = clickedElement.closet('li[dat-comment-id]');
        const commentId = commentLi.dateTime.commentId;
        checkCommentDelete(commentId);
        return;
    }
}

function checkCommentDelete(commentId) {
    if (confirm(`정말 삭제하시겠습니까?₩n₩n삭제한 게시글은 복구할 수 없습니다.`)) {
        console.log("댓글 삭제:", commentid);
    }
    //TODO 댓글도 삭제로직 필요
}

let currentPage = 1;
let isloading = false;
let hasMore = true;

async function loadNextPage() {
    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isloading||!hasMore) return;

    isloading = true;
    nextCursor = nextCursor;

    try {
        const { comments: newComments } = await getPosts(nextCursor);
        if (newComments === 0) {
            hasMore = false;
        } else {
            //TODO 댓글 렌더하는 로직
        }
    } catch (error) {
        console.error("다음 페이지 로딩 실패: ", error);
    } finally {
        isloading = false;
    }
}

function createObserver() {
    const trigger = document.getElementById('infinite-scroll-trigger');

    const option = {
        root: null, // null이면 뷰포트 전체
        threshold: 0.1 // 앵커가 10%만 보여도 콜백 실행
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            // 앵커(entry.target)이 화면에 보인다면
            if (entry.isIntersecting) {
                loadNextPage();
            }
        });
    };

    const observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
}