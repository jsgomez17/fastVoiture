const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
  base_value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Configuration", configurationSchema);
