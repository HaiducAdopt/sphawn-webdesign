import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "always", // rămâne /nl și /en mereu
});

export const config = {
  matcher: [
    "/((?!api|admin|_next|.*\\..*).*)",
  ],
};
