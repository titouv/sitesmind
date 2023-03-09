import Auth from "@/app/(auth)/account/auth"
import { LoggedIn } from "@/components/logged-in"
import Login from "@/supabase/components/login"
import { createClient } from "@/supabase/utils/server"

export default async function Page() {
  const supabase = createClient()
  const session = (await supabase.auth.getSession()).data.session
  {/* @ts-expect-error Async Server Component */}
  return session ? (<LoggedIn />) : <Auth />
}
