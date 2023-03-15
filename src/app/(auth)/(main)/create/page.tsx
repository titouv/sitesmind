import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";
import { Add } from "./add";

export default async function Page() {
  const supabase = createServerComponentClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return <div>error</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (profileError) {
    return <div>error</div>;
  }

  const { data: sites, error } = await supabase.from("sites").select();
  if (error) throw new Error(error.message);

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Get started
        </h1>
        {!profile.subscription_status && sites.length >= 5 ? (
          <div className="flex flex-col items-center gap-4 pt-8">
            <span>Your reach the free limit, subscribe to see more</span>
            <Link
              href={`https://site-gpt.lemonsqueezy.com/checkout/buy/f03c92ed-50ab-41b0-860d-5b9579433939?checkout[custom][user_id]=${user.id}`}
            >
              Subscribe
            </Link>
          </div>
        ) : (
          <Add />
        )}
      </div>
    </section>
  );
}
