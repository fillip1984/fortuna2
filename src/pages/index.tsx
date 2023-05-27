import { type NextPage } from "next";
import Head from "next/head";
import Timeline from "~/components/Timeline";
import BottomNav from "~/components/nav/BottomNav";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>fortuna</title>
        <meta
          name="fortuna"
          content="Fortuna app which tracks things of interest"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mb-[500px]">
        <Timeline />
        <BottomNav />
      </main>
    </>
  );
};

export default Home;
