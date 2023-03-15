export function GET() {
  // return timestamp and and version with variable NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA if it exists
  return {
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev",
  };
}
