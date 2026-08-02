const mongoose = require("mongoose");

const adminAuditSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'BLOCK_USER',
        'UNBLOCK_USER',
        'PROMOTE_ADMIN',
        'DEMOTE_ADMIN',
        'DELETE_LINK',
        'MARK_MALICIOUS',
        'VIEW_USERS',
        'VIEW_LINKS',
        'VIEW_STATS',
        'SEARCH_USERS'
      ]
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    targetUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url"
    },
    details: {
      type: String
    },
    ipAddress: {
      type: String
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AdminAudit", adminAuditSchema);
