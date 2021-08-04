import line from "@line/bot-sdk";
import * as t from "io-ts";
import type { Handler } from "@netlify/functions";

const bodyType = t.type({ user_id: t.string });

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || "{}");

  if (!bodyType.is(body)) {
    return { statusCode: 403 };
  }

  const client = new line.Client({
    channelSecret: process.env.BOT_CHANNELL_SECRET,
    channelAccessToken: process.env.BOT_CHANNEL_ACCESS_TOKEN!,
  });

  try {
    await client.pushMessage(body.user_id, {
      type: "text",
      text: "Mother is comming!",
    });

    return { statusCode: 200 };
  } catch {
    return { statusCode: 500 };
  }
};

export { handler };
