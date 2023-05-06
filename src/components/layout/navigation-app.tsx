import Link from "next/link";
import Image from "next/image";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MenuIcon } from "lucide-react";

const MENU_ITEMS = Object.freeze([
  { label: "Overview", path: "/dashboard" },
  { label: "Example Post", path: "/example-posts" },
]);

const NavigationApp = () => {
  return (
    <>
      <div className="hidden md:block">
        <NavigationDesktop />
      </div>
      <div className="block p-2 text-right md:hidden">
        <NavigationMobile />
      </div>
    </>
  );
};

const NavigationDesktop = () => {
  return (
    <aside className="flex h-screen w-64 flex-col space-y-6 overflow-hidden overflow-y-scroll border-r border-r-accent bg-white px-3 pb-3 pt-6">
      <div>
        <Link href="/dashboard" className="flex cursor-pointer px-2">
          <div className="flex cursor-pointer items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={22} height={22} />
            <div className="font-bold">luno</div>
          </div>
        </Link>
      </div>
      <div className="flex-grow">
        <NavigationMenu />
      </div>
      <div>
        <UserButton />
      </div>
    </aside>
  );
};

const NavigationMobile = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="rounded p-2 hover:bg-accent hover:text-accent-foreground">
          <MenuIcon className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex h-screen flex-col py-12">
          <div className="flex-grow">
            <NavigationMenu />
          </div>
          <div>
            <UserButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NavigationMenu = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    if (router.pathname === path) return true;
    return router.pathname.startsWith(`${path}/`);
  };

  const menuItemClasses = (path: string) => {
    const classesActive =
      "group flex w-full items-center rounded-md border px-2 py-2 bg-accent text-accent-foreground font-medium";
    const classesDefault =
      "group flex w-full items-center rounded-md border px-2 py-2 border-transparent hover:bg-accent";

    if (isActive(path)) return classesActive;
    return classesDefault;
  };

  return (
    <nav className="flex flex-col space-y-1 text-sm">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={menuItemClasses(item.path)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export { NavigationApp };
