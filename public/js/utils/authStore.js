// 유저가져오고..

window.authStore = {
    // ...
    getUser: function() {
        const userData = sessionStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },
    // (편의 함수 추가)
    getUserId: function() {
        const user = this.getUser();
        return user ? user.id : null;
    }
};