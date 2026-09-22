process.env.PORT ??= "3000";
process.env.HOSTNAME = process.env.RB_HOST ?? "127.0.0.1";
await import("../.next/standalone/server.js");
