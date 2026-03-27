const announcementService = require("./announcement.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");

const createAnnouncement = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin")
    throw new AppError("Admins only", 403);

  const { title, body, start_date, end_date } = req.body;

  if (!title?.trim()) throw new AppError("Title required", 400, "title");
  if (!body?.trim())  throw new AppError("Body required", 400, "body");

  const announcement = await announcementService.createAnnouncement({
    society_id: req.user.society_id,
    created_by: req.user.id,
    title: title.trim(),
    body: body.trim(),
    start_date,
    end_date
  });

  res.status(201).json({ success: true, data: announcement });
});

const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const data = await announcementService.getActiveAnnouncements(req.user.society_id);
  res.json({ success: true, data });
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin")
    throw new AppError("Admins only", 403);

  const data = await announcementService.getAllAnnouncements(
    req.user.society_id,
    req.query.page  || 1,
    req.query.limit || 10
  );

  res.json({ success: true, data });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const updated = await announcementService.editAnnouncement(req.params.id, req.body);

  if (!updated) throw new AppError("Announcement not found", 404);

  res.json({ success: true, data: updated });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const result = await announcementService.removeAnnouncement(req.params.id);

  if (!result) throw new AppError("Announcement not found", 404);

  res.json({ success: true, data: result });
});

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};