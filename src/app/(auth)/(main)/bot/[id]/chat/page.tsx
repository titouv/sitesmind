import Chat from "@/app/(auth)/(main)/bot/[id]/chat/chat";
export default async function Page({ params }: { params: { id: string } }) {
  return <Chat params={params} />;
}
