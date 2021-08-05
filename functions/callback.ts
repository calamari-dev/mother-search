import { parse } from "cookie";
import { stringify } from "query-string";
import { h } from "hastscript";
import { toHtml } from "hast-util-to-html";
import axios from "axios";
import * as t from "io-ts";
import type { Handler } from "@netlify/functions";

const callbackUrl = `${process.env.URL!}/.netlify/functions/callback`;
const interfaceUrl = `${process.env.URL!}`;
const stateType = t.type({ state: t.string });
const codeType = t.type({ code: t.string });

const createHtml = (user_id: string) => {
  const hast = h(null, [
    h("html", { lang: "ja" }, [
      h("meta", { charset: "utf-8" }),
      h("title", "Redirecting..."),
      h(
        "script",
        `localStorage.setItem("userId","${user_id}");` +
          `location.href="${interfaceUrl}";`
      ),
    ]),
  ]);

  return `<!DOCTYPE html>${toHtml(hast)}`;
};

const handler: Handler = async (event) => {
  const query = event.queryStringParameters;
  const cookie = parse(event.headers.cookie || "");

  if (!stateType.is(query) || !stateType.is(cookie)) {
    return { statusCode: 403 };
  }

  if (query.state !== cookie.state) {
    return { statusCode: 403 };
  }

  if (!codeType.is(query)) {
    return { statusCode: 500 };
  }

  try {
    const tokenRequest = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      stringify({
        grant_type: "authorization_code",
        code: query.code,
        redirect_uri: callbackUrl,
        client_id: process.env.LOGIN_CHANNEL_ID!,
        client_secret: process.env.LOGIN_CHANNEL_SECRET!,
      })
    );

    const { access_token } = tokenRequest.data;

    if (!access_token) {
      return { statusCode: 500 };
    }

    const idRequest = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { userId } = idRequest.data;

    if (!userId) {
      return { statusCode: 500 };
    }

    return {
      statusCode: 200,
      body: createHtml(userId),
    };
  } catch {
    return { statusCode: 500 };
  }
};

export { handler };
