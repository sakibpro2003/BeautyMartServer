import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { User } from "./user.model";
import AppError from "../../app/error/AppError";
import { TUser } from "./user.interface";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    console.log(userData,'userdata')
    const email = userData.email;
    const phone = userData.phone;
    const profileImage = userData.profileImage;
    console.log('hiiiiii')
    console.log(profileImage,'primage')
    const findUser = await User.findOne({ email });
    const findUserByPhone = await User.findOne({ phone });
    if (findUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Email already used");
    }
    if (findUserByPhone) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Phone number already used");
    }

    const result = await UserServices.createUserIntoDb(userData);
    const responseData = {
      _id: result?._id,
      name: result?.name,
      email: result?.email,
      profileImage:result?.profileImage,

    };
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: responseData,
    });
  }
);
const updateUserInfo = catchAsync(async (req: Request, res: Response) => {
  const { ...userPayload } = req.body;
  console.log(req.body);

  const user = req.user;

  const email = user?.email;
  userPayload.email = email;
  const findUser = await User.findOne({ email });
  const _id = findUser?._id;

  if (!_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  const result = await UserServices.updateUserInfoIntoDb(
    _id.toString(),
    userPayload
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found or update failed");
  }

  const responseData = {
    _id: result._id,
    name: result.name,
    phone: result.phone,
    gender: result.gender,
    profileImage:result.profileImage,
    coverImage:result.coverImage,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User information updated successfully",
    data: responseData,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const email = user?.email as string;
  // const profileImage = user?.profileImage as string;
  const result = await UserServices.getUserProfileFromDb(email);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found or update failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User information updated successfully",
    data: result,
  });
});

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUserFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  }
);
const changeUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, isBlocked } = req.body;

    const result = await UserServices.changeUserStatusIntoDb(userId, isBlocked);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      data: result,
    });
  }
);

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const email = req?.user?.email;

  if (!email) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Unauthorized request. Email missing!",
    });
  }

  const result = await UserServices.changeUserPasswordIntoDb(
    email,
    oldPassword,
    newPassword,
    confirmPassword
  );

  if (!result.success) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: result.message,
    });
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
  });
});

export const UserController = {
  changePassword,
  createUser,
  updateUserInfo,
  getAllUser,
  changeUserStatus,
  getUserProfile,
};
