const announcementModel = require("./announcement.model");

const createAnnouncement = async (data) => {
  if (new Date(data.end_date) < new Date(data.start_date)) {
    throw new Error("end_date must be on or after start_date");
  }
  return await announcementModel.createAnnouncement(data);
};

const getActiveAnnouncements = async (societyId) => {
  return await announcementModel.getActiveAnnouncements(societyId);
};

const getAllAnnouncements = async (societyId, page, limit) => {
  return await announcementModel.getAllAnnouncements(societyId, page, limit);
};

const editAnnouncement = async (id, data) => {
  if (new Date(data.end_date) < new Date(data.start_date)) {
    throw new Error("end_date must be on or after start_date");
  }
  return await announcementModel.updateAnnouncement(id, data);
};

const removeAnnouncement = async (id) => {
  return await announcementModel.deleteAnnouncement(id);
};

module.exports = {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  editAnnouncement,
  removeAnnouncement,
};