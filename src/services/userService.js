const userModel = require("../models/userModel");

// CREATE
const createUser = async (user) => {
  return await userModel.addUser(user);
};

// READ
const getUsers = async (societyId) => {
  return await userModel.getUsersBySociety(societyId);
};

// UPDATE
const editUser = async (id, user) => {
  return await userModel.updateUser(id, user);
};

// DELETE
const removeUser = async (id) => {
  return await userModel.deleteUser(id);
};

module.exports = { createUser, getUsers, editUser, removeUser };