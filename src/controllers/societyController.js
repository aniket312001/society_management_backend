const societyService = require("../services/societyService");

const getSocieties = async (req, res) => {
  try {
    const societies = await societyService.getSocieties();
    res.json(societies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getMySociety = async (req, res) => {
  try {

    const societyId = req.user.society_id;

    const society = await societyService.getSocietyById(societyId);

    res.json(society);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createSociety = async (req, res) => {
  try {
    console.log("In CreateSOcity");
    const { admin, society } = req.body;
    const result = await societyService.addSociety(admin, society);
    res.json(result);
  } catch (error) {

    console.error(error);
   if (error.message.includes("already exists")) {
      return res.status(400).json({ message: error.message });
    }
  
  
    res.status(500).json({ message: "Server error" });
  }
};

const updateSocieties = async (req, res) => {
  try {
    const { id } = req.params;
    const society = req.body;
    const result = await societyService.updateSociety(id, society);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteSocieties = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await societyService.deleteSociety(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSocieties, createSociety, updateSocieties, deleteSocieties,getMySociety };