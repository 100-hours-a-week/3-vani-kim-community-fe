import { getPost, updatePost } from "/js/api/postApi.js";
import { getPresignTempUrl, uploadToS3 } from "/js/api/image.js";
import { renderImagePreview, isFileSizeValid } from "/js/utils/fileUtils.js";

// URL에서 게시글 ID 가져오기
const path = window.location.pathname;
const parts = path.split('/');
const postId = parts[parts.length - 2]; // /update-post/{postId} 구조 가정

const MAX_POST_IMAGE_SIZE_MB = 10; // 10MB

let currentPost = null;
let isCurrentImageRemoved = false; // 기존 이미지 삭제 여부
let newImageFile = null; // 새로 업로드할 이미지 파일

// 페이지 초기화
async function initPage() {
    try {
        // 기존 게시글 데이터 가져오기
        currentPost = await getPost(postId);

        // 폼에 기존 데이터 채우기
        document.getElementById('title').value = currentPost.title;
        document.getElementById('content').value = currentPost.contentDetail.content;

        // 기존 이미지가 있으면 표시
        if (currentPost.postImageKey) {
            const currentImageSection = document.getElementById('current-image-section');
            const currentImage = document.getElementById('current-image');

            currentImage.src = currentPost.postImageKey;
            currentImageSection.style.display = 'block';
        }

    } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러올 수 없습니다.');
        window.location.href = '/';
    }
}

// 기존 이미지 삭제 버튼
document.getElementById('remove-current-image')?.addEventListener('click', () => {
    const currentImageSection = document.getElementById('current-image-section');
    currentImageSection.style.display = 'none';
    isCurrentImageRemoved = true;
});

// 새 이미지 선택
const imageInput = document.getElementById('image');
const newImagePreviewSection = document.getElementById('new-image-preview');
const previewImage = document.getElementById('preview-image');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        newImagePreviewSection.style.display = 'none';
        newImageFile = null;
        return;
    }

    // 파일 크기 검사
    if (!isFileSizeValid(file, MAX_POST_IMAGE_SIZE_MB)) {
        alert(`파일 크기는 ${MAX_POST_IMAGE_SIZE_MB}MB를 초과할 수 없습니다.`);
        imageInput.value = "";
        newImagePreviewSection.style.display = 'none';
        newImageFile = null;
        return;
    }

    // 새 이미지 미리보기
    renderImagePreview(file, previewImage, null);
    newImagePreviewSection.style.display = 'block';
    newImageFile = file;
});

// 새 이미지 삭제 버튼
document.getElementById('remove-new-image')?.addEventListener('click', () => {
    imageInput.value = "";
    newImagePreviewSection.style.display = 'none';
    newImageFile = null;
});

// 취소 버튼
document.getElementById('cancel-btn').addEventListener('click', () => {
    if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
        window.location.href = `/post/${postId}`;
    }
});

// 게시글 수정 폼 제출
document.getElementById('update-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content) {
        alert('내용을 입력해주세요.');
        return;
    }

    try {
        let postImageKey = null;

        // 이미지 처리 로직
        if (newImageFile) {
            // 새 이미지를 업로드하는 경우
            try {
                const { presignedUrl, fileUrl, contentType } = await getPresignTempUrl(
                    newImageFile.name,
                    newImageFile.type,
                    newImageFile.size
                );

                await uploadToS3(presignedUrl, newImageFile);
                postImageKey = fileUrl;

            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
                return;
            }
        } else if (!isCurrentImageRemoved && currentPost.postImageKey) {
            // 기존 이미지를 유지하는 경우
            postImageKey = currentPost.postImageKey;
        }
        // else: 이미지가 없는 경우 (기존 이미지 삭제 or 원래 없음) -> postImageKey = null

        // 게시글 수정 API 호출
        const updatedPost = await updatePost(postId, title, content, postImageKey);

        alert('게시글이 수정되었습니다.');
        window.location.href = `/post/${postId}`;

    } catch (error) {
        console.error('게시글 수정 실패:', error);

        if (error.response && error.response.status === 403) {
            alert('게시글 수정 권한이 없습니다.');
        } else if (error.response && error.response.status === 404) {
            alert('게시글을 찾을 수 없습니다.');
        } else {
            alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    }
});

// 페이지 로드 시 초기화
initPage();