var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// functions/handle.ts
__export(exports, {
  handler: () => handler
});
var isValid = (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    return body.CREDENTIAL === process.env.CREDENTIAL;
  } catch {
    return false;
  }
};
var handler = async (event, context) => {
  if (!isValid(event)) {
    return { statusCode: 403 };
  }
  return { statusCode: 200 };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=handle.js.map
