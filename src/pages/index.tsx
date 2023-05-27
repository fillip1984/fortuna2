import { type NextPage } from "next";
import Head from "next/head";
import Timeline from "~/components/Timeline";

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
      </main>
    </>
  );
};

export default Home;
