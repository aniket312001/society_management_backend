const visitorService = require("../services/visitorService");

// POST /visitors — any member adds a visitor
const addVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, visit_date } = req.body;

    if (!name?.trim())       return res.status(400).json({ field: "name",       message: "Name is required" });
    if (!visit_date?.trim()) return res.status(400).json({ field: "visit_date", message: "Visit date is required" });

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ field: "name", message: "Name must be 2–100 characters" });
    }

    const data = {
      society_id: req.user.society_id,
      added_by:   req.user.id,
      name:       name.trim(),
      phone:      phone?.trim() || null,
      purpose:    purpose?.trim() || null,
      visit_date,
    };

    const visitor = await visitorService.addVisitor(data);
    res.status(201).json(visitor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /visitors — list with filters (admin sees all, member sees own)
const getVisitors = async (req, res) => {
  try {
    const { society_id, role, id: userId } = req.user;
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const filters = {
      status: req.query.status,
      date:   req.query.date,
      search: req.query.search,
      // members only see their own; admins see all
      added_by: role === "admin" ? undefined : userId,
    };

    const visitors = await visitorService.getVisitors(society_id, page, limit, filters);
    res.json(visitors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /visitors/:id/status — admin only: approve or reject
const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) return res.status(400).json({ field: "status", message: "Status is required" });

    const visitor = await visitorService.updateStatus(id, status, note);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    res.json(visitor);
  } catch (err) {
    console.error(err);
    res.status(err.message.includes("must be") ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

// DELETE /visitors/:id — admin or the member who added it
const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await visitorService.getVisitor(id);

    if (!existing) return res.status(404).json({ message: "Visitor not found" });

    const isOwner = existing.added_by === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await visitorService.removeVisitor(id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addVisitor, getVisitors, updateStatus, deleteVisitor };