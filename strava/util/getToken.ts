import Cookies from "js-cookie";
export function getToken() {
    const token = Cookies.get("token");
    console.log(token);
    if (token) {
      return token;
    }
    return null;
  }
  
  