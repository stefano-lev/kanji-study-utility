import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  Cookies.set(key, JSON.stringify(value), { expires: 7, ...options }); // Default expiration: 7 days
};

export const getCookie = (key) => {
  const value = Cookies.get(key);
  return value ? JSON.parse(value) : null;
};

export const removeCookie = (key) => {
  Cookies.remove(key);
};

export const clearAllCookies = () => {
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookieKey) => {
    Cookies.remove(cookieKey);
  });
};
