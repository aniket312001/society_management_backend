const userService = require("../services/userService");

// CREATE user
const addUser = async (req, res) => {
  try {
    const user = req.body;
    const result = await userService.createUser(user);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ users by society
const getUsers = async (req, res) => {
  try {
    const { societyId } = req.params;
    const users = await userService.getUsers(societyId);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const result = await userService.editUser(id, user);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.removeUser(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };