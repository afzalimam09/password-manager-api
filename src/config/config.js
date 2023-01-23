import dotenv from "dotenv-safe";

dotenv.config();

export default {
    db: {
        str: process.env.DB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    enc: {
        joinId: process.env.DATA_JOIN_SEC,
        secret: process.env.DATA_ENC_SEC,
    },
};
