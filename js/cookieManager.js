class CookieManager {
    constructor() {
        this.cookies = {};
    }
    
    // Set a cookie
    setCookie(name, value = "", days = 7) {
        let expires = "";
        if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
        this.cookies[name] = value;
    }
    
    // Get a cookie
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') 
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) 
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Delete a cookie
    deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
        delete this.cookies[name];
    }
    
    // List all cookies
    listCookies() {
        return Object.keys(this.cookies).map(name => ({
        name: name,
        value: this.getCookie(name)
        }));
    }
}