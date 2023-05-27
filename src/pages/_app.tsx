import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import BottomNav from "~/components/nav/BottomNav";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <BottomNav />
    </>
  );
};

export default api.withTRPC(MyApp);
