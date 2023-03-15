import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/supabase/utils/server";
import Image from "next/image";

export async function ProfilePicture() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const avatarUrl = user.data.user?.user_metadata.avatar_url;
  const fullName = user.data.user?.user_metadata.full_name;

  if (!fullName) return null;

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  console.log("avatarUrl", avatarUrl);

  return (
    // <Image
    //   className="h-10 w-10 rounded-md"
    //   width={30}
    //   height={30}
    //   src={avatarUrl}
    //   alt="Profile picture"
    // />
    <Avatar>
      <AvatarImage src={avatarUrl} referrerPolicy="no-referrer" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
