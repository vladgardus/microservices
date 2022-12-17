import { getCookie } from "cookies-next";

type UserAuth = {
  id: string;
  email: string;
  iat: number;
};

const useAuth = () => {
  const session = getCookie("session");
  if (session) {
    let decoded = JSON.parse(Buffer.from(session.toString(), "base64").toString("utf8"));
    let userAuth = JSON.parse(Buffer.from(decoded.jwt.split(".")[1], "base64").toString("utf8")) as UserAuth;
    return userAuth;
  }
  return;
};

export default useAuth;
