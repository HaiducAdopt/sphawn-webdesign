import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Acceptăm doar nl/en
  if (locale !== "nl" && locale !== "en") {
    locale = "nl";
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
