const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    itemBranch: {
      type: String,
      required: true,
    },

    itemSemester: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Available",
    },

    photo: {
      type: String,
      default: "",
    },

    exchangeAvailable: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    seller: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      branch: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);