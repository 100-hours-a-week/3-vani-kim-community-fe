
document.addEventListener("DOMContentLoaded", function() {

    // 1. fetch로 layout.html 파일을 한 번만 가져옴
    fetch('/layout.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답 망함! (layout.html)');
            }
            return response.text();
        })
        .then(html => {
            // 2. 가져온 텍스트를 DOM 객체로 임시 변환
            // (DOMParser를 사용해 메모리 상에만 HTML을 만듦)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 3. 필요한 각 조각(header, sidebar, footer)을 ID로 찾음
            const headerHtml = doc.getElementById('layout-header')?.innerHTML;
            const sidebarHtml = doc.getElementById('layout-sidebar')?.innerHTML;
            const footerHtml = doc.getElementById('layout-footer')?.innerHTML;

            // 4. CSS 링크들을 <head>에 주입
            // (layout.html에 있던 <link> 태그들을 모두 찾아서 head에 추가)
            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                document.head.appendChild(link);
            });

            // 5. 각 placeholder에 찾은 HTML 조각을 주입
            injectHtml('header-placeholder', headerHtml);
            injectHtml('sidebar-placeholder', sidebarHtml);
            injectHtml('footer-placeholder', footerHtml);
        })
        .catch(error => {
            console.error('레이아웃 로드 실패:', error);
            // 실패 시 모든 placeholder에 에러 메시지 표시
            injectHtml('header-placeholder', '<p>헤더 로드 실패</p>', true);
            injectHtml('sidebar-placeholder', '<p>사이드바 로드 실패</p>', true);
            injectHtml('footer-placeholder', '<p>풋터 로드 실패</p>', true);
        });
});

/**
 * ID에 HTML을 주입하고, ID가 없는 경우 경고를 출력하는 헬퍼 함수
 * @param {string} id - HTML이 주입될 placeholder div의 ID
 * @param {string} html - 주입할 HTML 내용
 * @param {boolean} [isError=false] - 에러 상황인지 여부 (경고 무시)
 */
function injectHtml(id, html, isError = false) {
    const placeholder = document.getElementById(id);

    if (placeholder) {
        if (html) {
            placeholder.innerHTML = html;
        } else if (!isError) {
            console.warn(`layout.html에서 '#${id.replace('-placeholder', '')}' 조각을 찾지 못했습니다.`);
        }
    } else if (!isError) {
        // (예: 로그인 페이지에는 사이드바가 없을 수 있으므로, 이건 에러가 아님)
        console.warn(`'#${id}' 플레이스홀더가 현재 페이지에 없습니다.`);
    }
}