import mongo from "@fastify/mongodb";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ENV } from "../config/env";

export default fp(async function (app: FastifyInstance) {
  await app.register(mongo, {
    forceClose: true,
    url: ENV.MONGO_URI,
  });
  const db = app.mongo.db;

  if (!db) {
    app.log.error("MongoDB connection failed: no db instance available.");
    throw new Error("MongoDB connection failed.");
  }

  try {
    await db.command({ ping: 1 });
    const ve = await db.collection("vectors").findOne();
    console.log(ve);
    app.log.info(`MongoDB connected: ${db.databaseName}`);
  } catch (err) {
    app.log.error("MongoDB ping failed", err);
    throw err;
  }
});
