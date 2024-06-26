const asyncHandler = require("express-async-handler");
const Store = require("../models/storeModel");
const User = require("../models/userModel");

//POST -> /api/create-store
const createStore = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.body.vendor_id });
  if (!user) {
    res.status(400);
    throw new Error("vendor ID not found");
  }
  if (user.type !== 1) {
    res.status(403);
    throw new Error("Only vendors can create a store");
  }
  if (!req.body.latitude || !req.body.longitude) {
    res.status(400);
    throw new Error("Latitude or longitude not found");
  }
  const vendor = await Store.findOne({ vendor_id: req.body.vendor_id });
  if (vendor) {
    res.status(400);
    throw new Error("This vendor has already created a store");
  }
  const store = new Store({
    vendor_id: req.body.vendor_id,
    logo: req.file ? req.file.filename : null,
    business_email: req.body.business_email,
    address: req.body.address,
    pin: req.body.pin,
    location: {
      type: "Point",
      coordinates: [
        parseFloat(req.body.longitude),
        parseFloat(req.body.latitude),
      ],
    },
  });
  const createdStore = await store.save();
  res.status(200).json({ message: "Store created!", data: createdStore });
});

//GET -> /api/get-store
const getStore = async (id) => {
  const store = await Store.findOne({_id:id})
  return store
}

module.exports = { createStore , getStore};
