//API Layer
//Handle HTTP request & response.

const userService = require("../services/userService");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await userService.addUser(name, email);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, createUser };