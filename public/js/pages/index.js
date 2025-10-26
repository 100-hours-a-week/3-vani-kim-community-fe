import { getPosts } from "/js/api/postApi.js";

let isloading = false;
let hasMore = true;
let currentCursor = {
    id: undefined,
    createdAt: undefined
};
const PAGE_SIZE = 20;
const postListContainer = document.querySelector('.post-list-container');
//뭐가 다름? ElementById도 있잖슴
//ID 전용 검색기 <-> CSS셀렉터 만능 검색기(# 필수, 일치하는 첫 번째 요소 찾음, ID이외로 찾거나 복잡한 조건이면)

//TODO : 게시글목록 <template>방식으로 변경
/**
 * */
async function loadNextPage() {
    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isloading||!hasMore) return;
    isloading = true;

    try {
        const response = await getPosts(currentCursor.id, currentCursor.createdAt, PAGE_SIZE);

        const newPosts = response.items

        newPosts.forEach(post => {
            const postHtml=`
                <li class="post-item">
                    <a href="/post/${post.postId}">
                        <div class="content-area">
                            <h2 class="post-title">${post.title}</h2>
                            <div class="post-meta">
                                <div class="post-stats">
                                    <div class="likes">좋아요 ${post.stats.likeCount}</div>
                                    <div class="comments">댓글 ${post.stats.commentCount}</div>
                                    <div class="views">조회수 ${post.stats.viewCount}</div>
                                </div>
                                <time class="post-date" datetime="${post.createdAt}">
                                    ${new Date(post.createdAt).toLocaleDateString()}
                                </time>                            
                            </div>
                        </div>
                        <footer class="author-area">
                        
                            <!--TODO S3문제 해결-->
<!--                            <img src="${post.author.imageUrl || 'assets/author.png'}"> -->
                            <span>${post.author.nickname}</span>
                        </footer>
                    </a>
                </li>
            `;

            // 완성 박스 <ul>컨테이너에 추가하기
            postListContainer.insertAdjacentHTML("beforeend", postHtml);

        })

        hasMore = response.hasMore;

        if (hasMore) {
            currentCursor.id = response.nextCursor.id;
            currentCursor.createdAt = nextCursor.createdAt;
        }

        if(!hasMore) {
            console.log("마지막 페이지");
        }
    } catch (error) {
        console.error("다음 페이지 로딩 실패: ", error);
    } finally {
        isloading = false;
    }
}

function createObserver() {
    const trigger = document.getElementById('infinite-scroll-trigger');

    if(!trigger) {
        console.error("스크롤 trigger요소를 찾을 수 없음");
        return;
    }
    const option = {
        root: null, // null이면 뷰포트 전체
        threshold: 0.1 // 앵커가 10%만 보여도 콜백 실행
    };

    const callback = (entries) => {
        if (entries[0].isIntersecting && !isloading) {
            loadNextPage();
        }
    };

    const observer = new IntersectionObserver(callback, option);
    observer.observe(trigger);
}

document.addEventListener("DOMContentLoaded", ()=>{
    createObserver();
    loadNextPage();
});


