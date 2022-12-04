import { NextPageContext } from "next";
import { cookies } from "next/headers";
const LandingPage = async () => {
  console.log("cookies", cookies());
  // const nextCookie = cookies().getAll();
  // const sessionCookie = cookies().get("session");
  // console.log({ nextCookie, sessionCookie });
  // let res = await fetch("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser", { headers: { Host: "ticketing.dev" } });
  // console.log(res.body, res.status);

  return (
    <div>
      {/* Landing Page {JSON.stringify(res)} */}
      cookies: {JSON.stringify(cookies())}
    </div>
  );
};

export default LandingPage;
