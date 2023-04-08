import { Customize } from "@/app/(auth)/(main)/bot/[id]/customize/customize";
import { Title } from "@/components/title";
import { Link } from "@/components/ui/link";
import { createServerComponentClient } from "@/supabase/utils/server";
export const runtime = "edge";
export default async function Page({ params }: { params: { id: string } }) {
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

  const { data: sources, error } = await supabase.from("sources").select();
  if (error) throw new Error(error.message);

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <Title>Customize your bot</Title>
        <Customize botId={params.id} />
      </div>
    </section>
  );
}
