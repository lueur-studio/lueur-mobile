const { User, UserAuth } = require("../models");

const authRepository = {
  findUserByEmail: async (email) => {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: UserAuth,
          as: "auth",
          required: true,
        },
      ],
    });
  },

  findUserById: async (userId) => {
    return await User.findByPk(userId, {
      include: [
        {
          model: UserAuth,
          as: "auth",
          required: true,
        },
      ],
    });
  },

  createUserWithAuth: async (
    { name, email, password, refreshToken },
    transaction
  ) => {
    const user = await User.create(
      {
        name,
        email,
      },
      { transaction }
    );

    await UserAuth.create(
      {
        user_id: user.id,
        password_hash: password,
        refresh_token: refreshToken,
      },
      { transaction }
    );

    return user;
  },

  updateRefreshToken: async (userId, refreshToken) => {
    const userAuth = await UserAuth.findOne({ where: { user_id: userId } });
    if (!userAuth) return null;

    await userAuth.update({ refresh_token: refreshToken });
    return userAuth;
  },

  clearRefreshToken: async (userId) => {
    const userAuth = await UserAuth.findOne({ where: { user_id: userId } });
    if (!userAuth) return null;

    await userAuth.update({ refresh_token: null });
    return true;
  },

  checkEmailExists: async (email) => {
    const user = await User.findOne({ where: { email } });
    return !!user;
  },
};

module.exports = authRepository;
