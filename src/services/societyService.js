const societyModel = require("../models/societyModel");

// Get all societies
const getSocieties = async () => {
  const societies = await societyModel.getAllSocieties();
  return societies.map(s => ({
    id: s.id,
    name: s.name,
    address: s.address,
    status: s.status,
    description: s.description,
    created_at: s.created_at,
    admin: {
      id: s.admin_id,
      name: s.admin_name,
      email: s.admin_email
    }
  }));
};

const getSocietyById = async (id) => {
  return await societyModel.getSocietyById(id);
};

// Create society + admin
const addSociety = async (admin, society) => {
  return await societyModel.createSociety(admin, society);
};

// Update society
const updateSociety = async (id, society) => {
  return await societyModel.updateSociety(id, society);
};

// Delete society
const deleteSociety = async (id) => {
  return await societyModel.deleteSociety(id);
};

module.exports = { getSocieties, addSociety, updateSociety, deleteSociety,getSocietyById };