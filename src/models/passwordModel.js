import mongoose from "mongoose";

import db from "../connections/dbConnection.js";

const Schema = mongoose.Schema;

// Creating cab schema
const passwordSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

// Creating model from schema
export default db.model("Password", passwordSchema);
