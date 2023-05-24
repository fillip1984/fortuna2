import { type NextPage } from "next";
import Head from "next/head";
import WeighInList from "~/components/WeighInList";
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
      <main className="h-screen w-screen p-4">
        <WeighInList />
        <BottomNav />
      </main>
    </>
  );
};

export default Home;
