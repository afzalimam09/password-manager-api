import Password from "../../models/passwordModel.js";
import config from "../../config/config.js";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from "../handleFactory.js";
import { decrypt, encrypt } from "../../utils/encryptionHandler.js";
import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import User from "../../models/userModel.js";

export const protectMaster = catchAsync(async (req, res, next) => {
    const { master } = req.query;
    if (!master) {
        return next(new AppError("Master password is required!", 400));
    }
    const user = await User.findOne({ _id: req.user._id }).select(
        "+masterPassword"
    );

    if (!user.masterPassword) {
        return next(new AppError("Please create your master password!", 401));
    }

    if (!user || !(await user.correctPassword(master, user.masterPassword))) {
        return next(new AppError("Wrong Master Password!", 401));
    }
    next();
});

export const encryptData = (req, res, next) => {
    const { title, data } = req.body;

    const joinedData = data
        .map((item) => `${item.key}: ${item.value}`)
        .join(config.enc.joinId);

    const password = encrypt(joinedData);

    req.body = {
        title,
        password,
        userId: req.user._id,
    };
    next();
};

export const getPassword = catchAsync(async (req, res, next) => {
    const passwordData = await Password.findById(req.params.id);

    // Return an error if doc is not found
    if (!passwordData) {
        return next(new AppError("No doc found for given id", 404));
    }

    // Check if that doc belongs to the loggedin user
    if (passwordData.userId.toString() !== req.user._id.toString()) {
        return next(
            new AppError("This document does not belongs to you!", 404)
        );
    }

    const decPass = decrypt(passwordData.password).split(config.enc.joinId);

    res.status(200).json({
        status: "success",
        data: {
            title: passwordData.title,
            password: decPass,
        },
    });
});

export const updatePassword = (req, res) => {
    res.status(404).json({
        status: "success",
        message: "This route is not defined!",
    });
};

export const createPassword = createOne(Password);
export const getAllPasswords = getAll(Password);
export const deletePassword = deleteOne(Password);
