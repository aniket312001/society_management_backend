const userModel = require("./users.model");

// CREATE
const createUser = async (user) => {
  return await userModel.addUser(user);
};

// READ
const getUsers = async (societyId, page, limit,filters) => {
  return await userModel.getUsersBySociety(societyId, page, limit,filters);
};

// UPDATE
const editUser = async (id, user) => {
  return await userModel.updateUser(id, user);
};

const updatePassword = async (id, password) => {
  return await userModel.updatePassword(id, password);
}

// DELETE
const removeUser = async (id) => {
  return await userModel.deleteUser(id);
};

const getUserById = async (id) => {
  return await userModel.getUserById(id);
};

module.exports = { createUser, getUsers, editUser, removeUser,getUserById,updatePassword };