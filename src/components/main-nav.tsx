import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/supabase/utils/server";

interface MainNavProps {
  items?: NavItem[];
}

export async function MainNav({ items }: MainNavProps) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex gap-6 md:gap-10">
      <div className="hidden gap-2 md:flex">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <span className="hidden whitespace-nowrap rounded-md bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700 sm:inline-block">
          Alpha
        </span>
      </div>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href &&
              (!item.requireLogin || session) && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-4 text-base focus:ring-0 hover:bg-transparent md:hidden"
          >
            <Icons.logo className="mr-2 h-4 w-4" />{" "}
            <span className="font-bold">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={24}
          className="w-[300px] overflow-scroll"
        >
          <DropdownMenuLabel>
            <div className="flex gap-2">
              <Link href="/" className="flex items-center">
                <Icons.logo className="mr-2 h-4 w-4" /> {siteConfig.name}
              </Link>
              <span className=" whitespace-nowrap rounded-md bg-blue-100 px-2.5 py-0.5  text-sm text-blue-700">
                Alpha
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items?.map(
            (item, index) =>
              item.href &&
              (!item.requireLogin || session) && (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
