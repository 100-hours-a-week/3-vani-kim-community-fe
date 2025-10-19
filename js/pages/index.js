import { getPost } from "../api/posts";

//document.addEventListener("DOMContentLoaded", function() {}
const postListContainer = document.querySelector("#post-list");
//뭐가 다름? ElementById도 있잖슴
//ID 전용 검색기, CSS셀렉터 만능 검색기(# 필수, 일치하는 첫 번째 요소 찾음, ID이외로 찾거나 복잡한 조건이면)
async function init() {
    const posts = await getPost();

    // 텅빈 목록용 컨테이너 가져오기
    const postListContainer = document.querySelector("#post-list-container");

    // 잔여물 있을 수 있으니 비우기
    postListContainer.innerHTML = '';

    // 수신한 데이터로 박스 찍어내기
    posts.forEach(post => {
        const postHtml=`
            <li class="post-item">
                <a href="post-details.html">
                    <div class="content-area">
                        <h2 class="post-title">게시글 제목</h2>
                        <div class="post-meta">
                            <div class="post-stats">
                                <div class="likes">좋아요</div>
                                <div class="comments">댓글</div>
                                <div class="views">조회수</div>
                            </div>
                            <time class="post-date" datetime="2020-01-01">2020-01-01</time>
                        </div>


                    </div>
                    <footer class="author-area">
                        <img src="assets/author.png">
                        <span>작성자 나야 들기름</span>
                    </footer>
                </a>
            </li>
        `;

        // 완성 박스 <ul>컨테이너에 추가하기
        postListContainer.insertAdjacentHTML("beforeend", postHtml);

    })

}