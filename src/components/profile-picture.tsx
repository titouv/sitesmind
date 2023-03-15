import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createServerComponentClient } from "@/supabase/utils/server";

export async function ProfilePicture() {
  const supabase = createServerComponentClient();
  const user = await supabase.auth.getUser();
  const avatarUrl = user.data.user?.user_metadata.avatar_url;
  const fullName = user.data.user?.user_metadata.full_name;

  if (!fullName) return null;

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <Avatar>
      <AvatarImage src={avatarUrl} referrerPolicy="no-referrer" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
