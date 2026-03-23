const visitorModel = require("../models/visitorModel");

const addVisitor = async (data) => {
  return await visitorModel.createVisitor(data);
};

const getVisitors = async (societyId, page, limit, filters) => {
  return await visitorModel.getVisitorsBySociety(societyId, page, limit, filters);
};

const getVisitor = async (id) => {
  return await visitorModel.getVisitorById(id);
};

const updateStatus = async (id, status, note) => {
  const allowed = ["approved", "rejected"];
  if (!allowed.includes(status)) {
    throw new Error("Status must be 'approved' or 'rejected'");
  }
  return await visitorModel.updateVisitorStatus(id, status, note);
};

const removeVisitor = async (id) => {
  return await visitorModel.deleteVisitor(id);
};

module.exports = { addVisitor, getVisitors, getVisitor, updateStatus, removeVisitor };