const API_URL = "http://localhost:8080";

//fetchPosts 함수를 만들어서 '수출'하기
export async function getPosts() {
    const response = await fetch(`${API_URL}/posts`);
    return response.json()
}

export async function getPost(id) {
   try{
       const response = await fetch(`${API_URL}/posts/${id}`);
       return response.json();
   } catch(error){
       console.error('게시글 로드 실패', error);
   }

}

export async function createPost(post) {
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(post)
    });
    if (response.ok) {
        console.log(response);
    } else {
        console.error(response);
    }
}

export async function updatePost(id, post) {
    const response = await fetch(`${API_URL}/posts/${id}'`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(post)
    });
    if (response.ok) {
        console.log(response);
    } else {
        console.error(response);
    }
}

export async function deletePost(id) {
    const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (response.ok) {
        console.log(response);
    } else {
        console.error(response);
    }
}