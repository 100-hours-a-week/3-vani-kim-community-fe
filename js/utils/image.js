const API_URL = "http://localhost:8080";

//PresignedUrl key 요청 메서드
export async function getAnonymousPresignedUrl(FileName, FileType, FileSize) {
    //아직 서버에 구현이 없음
    const response = await fetch(`${API_URL}/images/presignedUrl`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            FileName,
            FileType,
            FileSize
        })
    });
    if(!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

export async function getAuthenticatedPresignedUrl(imageFileName, imageFileType, imageFileSize, uploadType) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_URL}/images/presigned-url/user`, { // 👈 (서버는 이 엔드포인트 하나만 열어둠)
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            imageFileName,
            imageFileType,
            imageFileSize,
            uploadType
        })
    });
    if(!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

//S3 presignedUrl Upload
//PUT으로 요청
//'Authorization' 헤더는 절대 추가 X Presigned URL 자체가 서명된 인증서 역할
export async function uploadToS3(presignedUrl, imageFile) {
    const response = await fetch(presignedUrl, {
        method: "PUT",

        headers: {
            contentType: imageFile.type
        },
        // json말고 그대로
        body : imageFile
    });

    if (!response.ok) {
        throw new Error('S3 업로드에 실패했습니다.');
    }

    return true;
}