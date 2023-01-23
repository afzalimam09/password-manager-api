import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import User from "../../models/userModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../handleFactory.js";
import bcryptjs from "bcryptjs";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const createMasterPassword = catchAsync(async (req, res, next) => {
    const { loginPassword, masterPassword, confirmMasterPassword } = req.body;
    if (!loginPassword || !masterPassword || !confirmMasterPassword) {
        return next(new AppError("All fields are required!", 400));
    }
    if (masterPassword !== confirmMasterPassword) {
        return next(new AppError("Master Password must be same!", 400));
    } else if (masterPassword.length < 4) {
        return next(
            new AppError(
                "Master Password must be of more than 4 character!",
                400
            )
        );
    }
    const user = await User.findOne({ _id: req.user._id }).select("+password");

    if (!user || !(await user.correctPassword(loginPassword, user.password))) {
        return next(new AppError("Wrong User or Login Password!", 401));
    }

    const hashedPassword = await bcryptjs.hash(masterPassword, 12);

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { masterPassword: hashedPassword },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

// No one can create a user. Use signup to create user
export const createUser = (req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "Rout is not defined yet, Please use signup instead!",
    });
};

// Update the id getting form logedin user to paramaete
export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password update. Please use api/v1/updateMyPassword",
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

// Delete a user
export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
});

export const getAllUsers = getAll(User);

export const getUser = getOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);
