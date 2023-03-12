import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/supabase/database.types";

const privatePaths = ["/create", "/sites"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && privatePaths.includes(req.nextUrl.pathname)) {
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("redirect", "true");
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}
