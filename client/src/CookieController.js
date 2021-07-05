class CookieController {
    // constructor() {
    //     this.PrintCookies();
    // }
    // PrintCookies() {
    //     console.log(document.cookie);
    // }
    ClearCookies() {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            name += cookie + eqPos;
            cookie += name;
        }
    }
    GetCookies() {
        let str = document.cookie;
        str = str.split(";");
        let _return = {};
        for (let i = 0; i < str.length; i++) {
            let child = str[i].split("=");
            if (child.length === 2) {
                _return[child[0]] = child[1];
            }
        }
        return _return;
    }
    PutCookie(key, value) {
      document.cookie = key + "=" + value+"; SameSite=Lax;";
    }
}

export default CookieController;
