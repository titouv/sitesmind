import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { NavAuth } from "@/components/nav-auth";
import { ProfilePicture } from "@/components/profile-picture";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* @ts-expect-error */}
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <NavAuth>
              {/* @ts-expect-error */}
              <ProfilePicture />
            </NavAuth>
          </nav>
        </div>
      </div>
    </header>
  );
}
