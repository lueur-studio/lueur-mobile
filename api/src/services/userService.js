const userRepository = require("../repository/userRepository");

const getCurrentUser = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (userId, updateData) => {
  // Check if email is being changed and if it's already in use
  if (updateData.email) {
    const user = await userRepository.findById(userId);
    if (user && updateData.email !== user.email) {
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new Error("Email is already in use");
      }
    }
  }

  const updatedUser = await userRepository.updateProfile(userId, updateData);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findByIdWithAuth(userId);

  if (!user || !user.auth) {
    throw new Error("User not found");
  }

  const isValidPassword = await user.auth.comparePassword(currentPassword);

  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  await userRepository.updatePassword(userId, newPassword);

  return true;
};

const deleteProfile = async (userId) => {
  const deleted = await userRepository.deleteProfile(userId);

  if (!deleted) {
    throw new Error("User not found");
  }

  return true;
};

module.exports = {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteProfile,
};
