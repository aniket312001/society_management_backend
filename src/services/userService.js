//Service calls model functions.
//Process data / logic before returning it.
//Business Logic Layer
//Service = logic + transformation

const userModel = require("../models/userModel");

const getUsers = async () => {
    const users = await userModel.getUsers();

  return users.map(user => ({
    id: user.id,
    name: user.name
  }));
};

const addUser = async (name, email) => {
  return await userModel.createUser(name, email);
};

module.exports = { getUsers, addUser };