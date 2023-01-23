import mongoose from "mongoose";
import config from "../config/config.js";

mongoose.connect(config.db.str, config.db.options);

const db = mongoose.connection;

//When successfully connected
db.on("connected", () => {
    console.log("Database connected successfully!!");
});

//If the connection throws an error
db.on("error", (err) => {
    console.log(`Mongoose connection error for master DB: ${err}`);
});

// When the connection is disconnected
db.on("disconnected", () => {
    console.log("Mongoose connection disconnected for master DB");
});

// When connection is reconnected
db.on("reconnected", () => {
    console.log("Mongoose connection reconnected for master DB");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
    db.close(() => {
        console.log(
            "Mongoose connection disconnected for master DB through app termination"
        );
        // eslint-disable-next-line no-process-exit
        process.exit(0);
    });
});

export default db;
