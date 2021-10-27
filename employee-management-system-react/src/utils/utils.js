export const authorize = (token) => {
  localStorage.setItem("token", token);
};

export const unAuthorize = () => {
  localStorage.removeItem("token");
};

export const isLogin = () => {
  if (
    !localStorage.getItem("token") ||
    !localStorage.getItem("token").toString().trim()
  )
    return false;
  else return true;
};
