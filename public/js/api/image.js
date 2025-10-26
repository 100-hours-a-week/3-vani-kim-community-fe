const API_URL = "http://localhost:8080";
import apiClient from "/js/api/api.js";

export async function getPresignTempUrl(fileName, contentType, fileSize){
    try{
        const response = await apiClient.post(`${API_URL}/api/v1/uploads/presign/temp`, {
            fileName,
            contentType,
            fileSize
        })
        return response;
    } catch (error) {
        console.error('업로드 URL 발급 실패', error);
        throw error;
    }
}

export async function getPresignUrl(fileName, contentType, fileSize, category){
    try{
        const response = await apiClient.post(`${API_URL}/api/v1/uploads/presign/temp`,
            fileName,
            contentType,
            fileSize,
            category
            );
        return response;
    } catch (error) {
        console.error('업로드 URL 발급 실패', error);
        throw error;
    }
}

//S3 presignedUrl Upload
//PUT으로 요청
//'Authorization' 헤더는 절대 추가 X Presigned URL 자체가 서명된 인증서 역할
export async function uploadToS3(presignedUrl, imageFile) {
    try {
        const response = await fetch(presignedUrl, {
            method: "PUT",

            headers: {
                'Content-Type': imageFile.type
            },
            // json말고 그대로
            body: imageFile
        });

        if (!response.ok) {
            throw new Error(`S3 업로드에 실패했습니다. : ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('이미지 업로드 실패', error);
        throw error;
    }
}