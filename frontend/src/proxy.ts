export async function proxy() {
  // to-do
}

export const config = {
  matcher: [
    /**
     * Match all paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - any image files (svg, png, etc.)
     * - parquet files
     * - font files (woff, woff2, ttf, otf, eot)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|parquet|woff|woff2|ttf|otf|eot)$).*)",
  ],
};
