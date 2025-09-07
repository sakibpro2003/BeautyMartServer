import { TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";

const createUserIntoDb = async (userData: TUser) => {
  const result = await User.create(userData);
  console.log(result,'result service crate')
  return result;
};

const updateUserInfoIntoDb = async (_id: string, userData: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(_id, userData, { new: true });
  return result;
};

const getUserProfileFromDb = async (email: string) => {
  const result = await User.findOne({ email }).select("-password");
  return result;
};

const getAllUserFromDb = async () => {
  const result = await User.find();
  return result;
};

const changeUserStatusIntoDb = async (userId: string, isBlocked: boolean) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked },
    { new: true }
  );

  return result;
};

const changeUserPasswordIntoDb = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (!email) {
    return { success: false, message: "Unauthorized request. Email missing!" };
  }

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All password fields are required!" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match!" };
  }

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return { success: false, message: "User not found!" };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return { success: false, message: "Old password is incorrect!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.updateOne({ email }, { $set: { password: hashedPassword } });

  return { success: true, message: "Password changed successfully!" };
};

export const UserServices = {
  createUserIntoDb,
  changeUserPasswordIntoDb,
  getAllUserFromDb,
  changeUserStatusIntoDb,
  updateUserInfoIntoDb,
  getUserProfileFromDb,
};
