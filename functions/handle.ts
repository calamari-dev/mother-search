import type { Handler, HandlerEvent } from "@netlify/functions";

const isValid = (event: HandlerEvent) => {
  try {
    const body = JSON.parse(event.body || "{}");
    return body.CREDENTIAL === process.env.CREDENTIAL;
  } catch {
    return false;
  }
};

const handler: Handler = async (event, context) => {
  if (!isValid(event)) {
    return { statusCode: 403 };
  }

  return { statusCode: 200 };
};

export { handler };
