const societyService = require("./society.service");
const asyncHandler = require("../../helpers/asyncHandler");
const AppError = require("../../exceptions/app.error");

const getSocieties = asyncHandler(async (req, res) => {
  const societies = await societyService.getSocieties();
  res.json({ success: true, data: societies });
});

const getMySociety = asyncHandler(async (req, res) => {
  const society = await societyService.getSocietyById(req.user.society_id);
  res.json({ success: true, data: society });
});

const createSociety = asyncHandler(async (req, res) => {
  const { admin, society } = req.body;

  if (!admin || !society)
    throw new AppError("Admin and society data required", 400);

  const result = await societyService.addSociety(admin, society);
  res.status(201).json({ success: true, data: result });
});

const updateSocieties = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await societyService.updateSociety(id, req.body);

  if (!result) throw new AppError("Society not found", 404);

  res.json({ success: true, data: result });
});

const deleteSocieties = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await societyService.deleteSociety(id);

  if (!result) throw new AppError("Society not found", 404);

  res.json({ success: true, data: result });
});

module.exports = { getSocieties, createSociety, updateSocieties, deleteSocieties, getMySociety };