module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.createCollection("users");
  },

  async down(db) {
    try {
      console.log("Dropping users collection...");
      // TODO write the statements to rollback your migration (if possible)
      // Example:
      try {
        await db.collection("users").deleteMany({});
        console.log("Users collection dropped successfully.");
      } catch (error) {
        console.error("Error dropping users collection:", error);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
