import { createClient } from "@/supabase/utils/server"

export async function LoggedIn() {
  const supabase = createClient()
  const user = await supabase.auth.getUser()
  const email = user.data.user?.email
  return <p>Logged as :{email}</p>
}
