const userService = require("./users.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");

const addUser = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name?.trim())  throw new AppError("Name is required", 400, "name");
  if (!email?.trim()) throw new AppError("Email is required", 400, "email");
  if (!phone?.trim()) throw new AppError("Phone is required", 400, "phone");

  if (name.length < 2 || name.length > 100)
    throw new AppError("Name must be 2–100 characters", 400, "name");

  const user = await userService.createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    society_id: req.user.society_id,
    role: "member",
    status: "pending",
    password: ""
  });

  res.status(201).json({ success: true, data: user });
});

const getUsers = asyncHandler(async (req, res) => {
  const { society_id } = req.user;
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filters = {
    status: req.query.status,
    role:   req.query.role,
    search: req.query.search
  };

  const users = await userService.getUsers(society_id, page, limit, filters);
  res.json({ success: true, data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;

  if (!name?.trim())  throw new AppError("Name required", 400, "name");
  if (!email?.trim()) throw new AppError("Email required", 400, "email");
  if (!phone?.trim()) throw new AppError("Phone required", 400, "phone");

  const updated = await userService.editUser(id, {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role,
    status,
    society_id: req.user.society_id
  });

  if (!updated) throw new AppError("User not found", 404);

  res.json({ success: true, data: updated });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.removeUser(id);

  if (!user) throw new AppError("User not found", 404);

  res.json({ success: true, data: user });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (!user) throw new AppError("User not found", 404);

  res.json({ success: true, data: user });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) throw new AppError("Password required", 400);

  const result = await userService.updatePassword(id, password);
  res.json({ success: true, data: result });
});

module.exports = { addUser, getUsers, updateUser, deleteUser, getMyProfile, updatePassword };