const userService = require("../services/userService");

// CREATE user
const addUser = async (req, res) => {
  try {

   const { name, email, phone, password } = req.body;

    // Required fields
    if (!name?.trim())     return res.status(400).json({ field: "name",    message: "Name is required" });
    if (!email?.trim())    return res.status(400).json({ field: "email",   message: "Email is required" });
    if (!phone?.trim())    return res.status(400).json({ field: "phone",   message: "Phone is required" });
 
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ field: "name", message: "Name 2–100 characters" });
    }


    if (req.body.status && req.body.status !== 'pending') {
      return res.status(403).json({ message: "Cannot set status" });
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      society_id: req.user.society_id,
      role: 'member',
      status: 'pending',
      password: ""
    };

 
    const result = await userService.createUser(userData);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ users by society
const getUsers = async (req, res) => {
  try {
    const { society_id } = req.user;
     const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

      const status = req.query.status; // pending / active / rejected
    const role = req.query.role;     // admin / member
    const search = req.query.search; // name/email/phone

    const users = await userService.getUsers(society_id, page, limit,{ status, role, search });
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
    
   const { name, email, phone, password, role, status } = req.body;
    console.log(`updateUser - ${id}`);
    // Required fields
    if (!name?.trim())     return res.status(400).json({ field: "name",    message: "Name is required" });
    if (!email?.trim())    return res.status(400).json({ field: "email",   message: "Email is required" });
    if (!phone?.trim())    return res.status(400).json({ field: "phone",   message: "Phone is required" });
    if (!role?.trim())    return res.status(400).json({ field: "role",   message: "role is required" });
    if (!status?.trim())    return res.status(400).json({ field: "status",   message: "status is required" });
 
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ field: "name", message: "Name 2–100 characters" });
    }


    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      society_id: req.user.society_id,
      role: role,
      status: status,
      password: password
    };

    const result = await userService.editUser(id, userData);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) =>  {
   try {
    const { id } = req.params;
    const { password }= req.body;
    const result = await userService.updatePassword(id, password);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

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

const getMyProfile = async (req, res) => {
  try {
    console.log("in my profile");

    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser,getMyProfile, updatePassword };