import { serialize } from "cookie";
import { stringify } from "query-string";
import { v4 as createUuid } from "uuid";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import type { Handler } from "@netlify/functions";
import { callbackUrl } from "./config";

const createHtml = (state: string) => {
  const params = stringify({
    response_type: "code",
    client_id: process.env.LOGIN_CHANNEL_ID,
    state,
    redirect_uri: callbackUrl,
    scope: "profile",
  });

  const redirect = `https://access.line.me/oauth2/v2.1/authorize?${params}`;

  const hast = h(null, [
    h("html", { lang: "ja" }, [
      h("meta", { charset: "utf-8" }),
      h("title", "Redirecting..."),
      h("script", `location.href="${redirect}";`),
    ]),
  ]);

  return `<!DOCTYPE html>${toHtml(hast)}`;
};

const handler: Handler = async () => {
  const state = createUuid().replace(/-/g, "");

  const cookie = serialize("state", state, {
    secure: true,
    httpOnly: true,
    path: "/",
    maxAge: 300,
  });

  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": cookie,
      "Cache-Control": "no-cache",
      "Content-Type": "text/html",
    },
    body: createHtml(state),
  };
};

export { handler };
