import { getPosts } from "/js/api/postApi.js";

let isLoading = false;
let hasMore = true;
let currentCursor = {
    id: undefined,
    createdAt: undefined
};
const PAGE_SIZE = 20;
const postListContainer = document.querySelector('.post-list-container');
const postTemplate = document.getElementById('post-item-template');

const scrollTrigger = document.getElementById('infinite-scroll-trigger');
const endMessage = document.getElementById('end-of-list-message');
//뭐가 다름? ElementById도 있잖슴
//ID 전용 검색기 <-> CSS셀렉터 만능 검색기(# 필수, 일치하는 첫 번째 요소 찾음, ID이외로 찾거나 복잡한 조건이면)

/**
 * 다음 페이지를 불러오는 함수
 * */
async function loadNextPage() {
    // 이미 로딩중이거나, 더이상 데이터 없다면 중단
    if (isLoading||!hasMore) return;
    isLoading = true;

    try {
        const response = await getPosts(currentCursor.id, currentCursor.createdAt, PAGE_SIZE);
        const newPosts = response.items;

        //템플릿을 이용하여 DOM 생성하기
        newPosts.forEach(post => {
            // 템플릿의 태그 안의 내용(li)를 복제
            // true는 템플릿 내부늬 모든 자식 요소까지 깊게 복사하라는 의미
            const postFragment = postTemplate.content.cloneNode(true);

            // 조각들 안에서 요소 탐색
            const postLink = postFragment.querySelector('.post-link');
            const postTitle = postFragment.querySelector('.post-title');
            const likes = postFragment.querySelector('.likes');
            const comments = postFragment.querySelector('.comments');
            const views = postFragment.querySelector('.views');
            const postDate = postFragment.querySelector('.post-date');
            // const authorImage = postFragment.querySelector('.author-image');
            const authorNickname = postFragment.querySelector('.author-nickname');

            //템플릿 채우기
            postLink.href = `/post/${post.postId}`;
            postTitle.textContent = post.title;
            likes.textContent = `좋아요 수 ${post.stats.likeCount}`;
            views.textContent = `조회수 ${post.stats.viewCount}`;
            comments.textContent = `댓글수 ${post.stats.commentCount}`;

            const date = new Date(post.createdAt);
            postDate.datetime = date.toISOString();
            postDate.textContent = date.toLocaleDateString();

            authorNickname.textContent = post.authorNickname;
            // authorImage.src = post.author.imageUrl || 'assets/author.png';

            // 완성된 li들을 ul에 추가
            postListContainer.appendChild(postFragment);
        });

        hasMore = response.hasMore;

        if (hasMore) {
            currentCursor.id = response.nextCursor.id; // TODO 헷깔려~ postId가 맞지 않냐?
            currentCursor.createdAt = response.nextCursor.createdAt;
        }

        if(!hasMore) {
            // TODO 사용자에게도
            console.log("마지막 페이지");

            if (endMessage) {
                endMessage.style.display = 'block';
            }

            if (scrollTrigger) {
                scrollTrigger.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("다음 페이지 로딩 실패: ", error);
    } finally {
        isLoading = false;
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
        if (entries[0].isIntersecting && !isLoading) {
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


