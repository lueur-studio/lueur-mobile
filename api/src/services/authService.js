const { User } = require("../models");
const authRepository = require("../repository/authRepository");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const signup = async ({ name, email, password }) => {
  const emailExists = await authRepository.checkEmailExists(email);

  if (emailExists) {
    throw new Error("User with this email already exists");
  }

  const result = await User.sequelize.transaction(async (t) => {
    const payload = {
      name,
      email,
    };
    const accessToken = generateAccessToken({ ...payload });
    const refreshToken = generateRefreshToken({ ...payload });

    const user = await authRepository.createUserWithAuth(
      {
        name,
        email,
        password,
        refreshToken,
      },
      t
    );

    // Reason for regenerating tokens: user id is only available after creation
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const finalAccessToken = generateAccessToken(userPayload);
    const finalRefreshToken = generateRefreshToken(userPayload);

    await authRepository.updateRefreshToken(user.id, finalRefreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken: finalAccessToken,
      refreshToken: finalRefreshToken,
    };
  });

  return result;
};

const signin = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user || !user.auth) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await user.auth.comparePassword(password);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await authRepository.updateRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await authRepository.findUserById(decoded.id);

  if (!user || !user.auth || user.auth.refresh_token !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await authRepository.updateRefreshToken(user.id, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (userId) => {
  const result = await authRepository.clearRefreshToken(userId);

  if (!result) {
    throw new Error("User not found");
  }

  return true;
};

module.exports = {
  signup,
  signin,
  refreshAccessToken,
  logout,
};
