import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { REDIS_SECRET, __prod__ } from "./constants";

const RedisStore = connectRedis(session);
const redisClient = new Redis();

// redisClient.on("error", console.error);

const PORT = 4000;
const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        database: "test",
        username: "postgres",
        password: "google",
        logging: true,
        entities: [path.join(__dirname, "entities/*.js")],
        synchronize: true,
    });

    const app = express();

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
                disableTTL: true,
            }),
            secret: REDIS_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 20, // 20 years
                httpOnly: !__prod__,
                secure: __prod__,
                sameSite: "lax",
            },
        })
    );

    // app.use((req, _, next) => {
    //     if (!req.session) {
    //         return next(new Error(" session not found"));
    //     }
    //     next();
    // });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [path.join(__dirname, "./resolvers/**/*.js")],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () =>
        console.log(`server running on localhost:${PORT}/graphql`)
    );
};

main().catch(err => console.error(err));
