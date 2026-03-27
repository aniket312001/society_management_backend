const visitorService = require("./visitors.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");

const addVisitor = asyncHandler(async (req, res) => {
  const { name, phone, purpose, visit_date } = req.body;

  if (!name?.trim())       throw new AppError("Name is required", 400, "name");
  if (!visit_date?.trim()) throw new AppError("Visit date is required", 400, "visit_date");

  if (name.length < 2 || name.length > 100)
    throw new AppError("Name must be 2–100 characters", 400, "name");

  const visitor = await visitorService.addVisitor({
    society_id: req.user.society_id,
    added_by:   req.user.id,
    name:        name.trim(),
    phone:       phone?.trim() || null,
    purpose:     purpose?.trim() || null,
    visit_date,
  });

  res.status(201).json({ success: true, data: visitor });
});

const getVisitors = asyncHandler(async (req, res) => {
  const { society_id, role, id: userId } = req.user;
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filters = {
    status:    req.query.status,
    date:      req.query.date,
    search:    req.query.search,
    added_by:  role === "admin" ? undefined : userId,
  };

  const visitors = await visitorService.getVisitors(society_id, page, limit, filters);
  res.json({ success: true, data: visitors });
});

const updateStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin")
    throw new AppError("Admins only", 403);

  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) throw new AppError("Status is required", 400, "status");

  const visitor = await visitorService.updateStatus(id, status, note);

  if (!visitor) throw new AppError("Visitor not found", 404);

  res.json({ success: true, data: visitor });
});

const deleteVisitor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await visitorService.getVisitor(id);

  if (!existing) throw new AppError("Visitor not found", 404);

  const isOwner = existing.added_by === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin)
    throw new AppError("Not authorized", 403);

  const result = await visitorService.removeVisitor(id);
  res.json({ success: true, data: result });
});

module.exports = { addVisitor, getVisitors, updateStatus, deleteVisitor };