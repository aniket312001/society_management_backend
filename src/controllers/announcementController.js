const announcementService = require("../services/announcementService");

// POST /announcements — admin only
const createAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { title, body, start_date, end_date } = req.body;

    if (!title?.trim())      return res.status(400).json({ field: "title",      message: "Title is required" });
    if (!body?.trim())       return res.status(400).json({ field: "body",       message: "Body is required" });
    if (!start_date?.trim()) return res.status(400).json({ field: "start_date", message: "Start date is required" });
    if (!end_date?.trim())   return res.status(400).json({ field: "end_date",   message: "End date is required" });

    const data = {
      society_id:  req.user.society_id,
      created_by:  req.user.id,
      title:       title.trim(),
      body:        body.trim(),
      start_date,
      end_date,
    };

    const announcement = await announcementService.createAnnouncement(data);
    res.status(201).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(err.message.includes("end_date") ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

// GET /announcements/active — all members (only shows date-range active ones)
const getActiveAnnouncements = async (req, res) => {
  try {
    const { society_id } = req.user;
    const announcements = await announcementService.getActiveAnnouncements(society_id);
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /announcements — admin management list (all, paginated)
const getAllAnnouncements = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const { society_id } = req.user;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;

    const announcements = await announcementService.getAllAnnouncements(society_id, page, limit);
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /announcements/:id — admin only
const updateAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { id } = req.params;
    const { title, body, start_date, end_date } = req.body;

    if (!title?.trim())      return res.status(400).json({ field: "title",      message: "Title is required" });
    if (!body?.trim())       return res.status(400).json({ field: "body",       message: "Body is required" });
    if (!start_date?.trim()) return res.status(400).json({ field: "start_date", message: "Start date is required" });
    if (!end_date?.trim())   return res.status(400).json({ field: "end_date",   message: "End date is required" });

    const updated = await announcementService.editAnnouncement(id, { title: title.trim(), body: body.trim(), start_date, end_date });
    if (!updated) return res.status(404).json({ message: "Announcement not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(err.message.includes("end_date") ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

// DELETE /announcements/:id — admin only
const deleteAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const { id } = req.params;
    const result = await announcementService.removeAnnouncement(id);
    if (!result) return res.status(404).json({ message: "Announcement not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};