import { Link } from "@/components/ui/link";
import { BASE_URL } from "@/config/site";
import { Code } from "bright";

Code.theme = "github-dark";

export default function Page({ params }: { params: { id: string } }) {
  const code = `
<iframe
    src="${BASE_URL}/chat/${params.id}/embed"
    width="560"
    height="315"
    frameBorder="0"
    allowFullScreen
/>`.trim();
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          How to use your chat on your website
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <span>
          Copy and paste the following code into your website to embed the chat
        </span>
        {/* @ts-expect-error */}
        <Code className="max-w-xl" lang="js">
          {code}
        </Code>
        <Link href={`/chat/${params.id}`}>Go back to chat</Link>
      </div>
    </section>
  );
}
