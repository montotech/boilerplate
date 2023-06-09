import { type NextPage } from "next";

import { NavigationHomepage } from "@/components/layout/navigation-homepage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <NavigationHomepage />
      <main className="flex items-center justify-center px-4 text-center sm:px-8 ">
        <div className="mt-20 flex max-w-[1100px] flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            A better way to [placeholder]
          </h1>
          <p className="max-w-[640px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Luno is ultimate tool for building minimum viable products at
            lightning speed.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg">Get started</Button>
            </Link>
          </div>
        </div>
      </main>
      <div className="m-auto max-w-5xl px-12 pt-12 2xl:max-w-7xl">
        <Image
          src="/screenshot-app.png"
          alt="screenshot of app"
          width={2310}
          height={1118}
          className="rounded-t-3xl border border-b-0 shadow-2xl 2xl:rounded-3xl 2xl:border-b"
        />
      </div>
    </>
  );
};

export default Home;
