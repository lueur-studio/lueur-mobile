const { User, UserAuth } = require("../models");

const userRepository = {
  findById: async (id) => {
    return await User.findByPk(id, {
      attributes: ["id", "name", "email", "created_at", "updated_at"],
    });
  },

  findByIdWithAuth: async (id) => {
    return await User.findByPk(id, {
      include: [
        {
          model: UserAuth,
          as: "auth",
          required: true,
        },
      ],
    });
  },

  findByEmail: async (email) => {
    return await User.findOne({ where: { email } });
  },

  updateProfile: async (id, updateData) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    const { name, email } = updateData;
    await user.update({ name, email });

    return user.toJSON();
  },

  updatePassword: async (userId, newPassword) => {
    const userAuth = await UserAuth.findOne({ where: { user_id: userId } });
    if (!userAuth) return null;

    await userAuth.update({ password_hash: newPassword });
    return true;
  },

  deleteProfile: async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return true;
  },
};

module.exports = userRepository;
