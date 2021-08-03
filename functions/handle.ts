import line from "@line/bot-sdk";
import type { Handler, HandlerEvent } from "@netlify/functions";

const isValid = (event: HandlerEvent) => {
  try {
    const body = JSON.parse(event.body || "{}");
    return body.CREDENTIAL === process.env.CREDENTIAL;
  } catch {
    return false;
  }
};

const handler: Handler = async (event) => {
  if (!isValid(event)) {
    return { statusCode: 403 };
  }

  const client = new line.Client({
    channelSecret: process.env.CHANNELL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
  });

  try {
    await client.pushMessage(process.env.USERID!, {
      type: "text",
      text: "Mother is comming!",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "succeed" }),
    };
  } catch {
    return { statusCode: 500 };
  }
};

export { handler };
