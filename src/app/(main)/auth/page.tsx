import { ProfilePicture } from "@/app/(main)/profile-picture";
import { NavAuth } from "@/components/nav-auth";

export default function Page() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Authentication
        </h1>
        <div className="py-8">
          <NavAuth>
            {/* @ts-expect-error */}
            <ProfilePicture />
          </NavAuth>
        </div>
      </div>
    </section>
  );
}
