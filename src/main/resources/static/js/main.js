function logout() {
    document.cookie = "authToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function goToMessages(){
    window.location.href = "messages_page.html";
}

function goToProfile(){
    window.location.href = "page_of_user.html?my";
}

function goToSearch(){
    window.location.href = "search_page.html";
}
