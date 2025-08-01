const rules = {
  users: {
    allow: {
      create: "true",  // Anyone can create a user (sign up)
      read: "true",    // Anyone can read users (for login check)
      update: "true",  // For now, allow all updates
      delete: "true",  // For now, allow all deletes
    },
  },
  apps: {
    allow: {
      create: "true",  // Anyone can create apps
      read: "true",    // Anyone can read apps
      update: "true",  // For now, allow all updates
      delete: "true",  // For now, allow all deletes
    },
  },
};

export default rules;