const bcrypt = require("bcrypt");

const buildUpdateData = async (body, file) => {
  const allowedFields = ["username", "email"];
  const updateData = Object.fromEntries(
    allowedFields
      .filter((key) => body[key])
      .map((key) => [key, body[key]])
  );

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  if (file) {
    updateData.profile = `/profiles/${file.filename}`;
  }

  return updateData;
};

module.exports = buildUpdateData;
