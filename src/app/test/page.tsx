/* eslint-disable @next/next/no-sync-scripts */

import { Title } from "@/components/title";

export default function Page() {
  return (
    <div>
      <script src="http://localhost:3000/embed_local.js" id="test" />
      <Title>Embed</Title>
    </div>
  );
}
