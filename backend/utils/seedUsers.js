const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

const users = [
  {
    name: "Emma Johnson",
    email: "emma.johnson@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Liam Smith",
    email: "liam.smith@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Olivia Williams",
    email: "olivia.williams@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "Noah Brown",
    email: "noah.brown@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Ava Jones",
    email: "ava.jones@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Ethan Garcia",
    email: "ethan.garcia@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "Mason Rodriguez",
    email: "mason.rodriguez@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Isabella Davis",
    email: "isabella.davis@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "William Miller",
    email: "william.miller@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Mia Wilson",
    email: "mia.wilson@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "James Moore",
    email: "james.moore@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Charlotte Taylor",
    email: "charlotte.taylor@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Benjamin Anderson",
    email: "benjamin.anderson@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Amelia Thomas",
    email: "amelia.thomas@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "Lucas Jackson",
    email: "lucas.jackson@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Harper White",
    email: "harper.white@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Henry Harris",
    email: "henry.harris@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Evelyn Martin",
    email: "evelyn.martin@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "Alexander Thompson",
    email: "alexander.thompson@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Abigail Garcia",
    email: "abigail.garcia@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Michael Martinez",
    email: "michael.martinez@eduverse.com",
    level: "Junior",
    role: "student",
  },
  {
    name: "Emily Robinson",
    email: "emily.robinson@eduverse.com",
    level: "Freshman",
    role: "student",
  },
  {
    name: "Daniel Clark",
    email: "daniel.clark@eduverse.com",
    level: "Senior",
    role: "student",
  },
  {
    name: "Elizabeth Rodriguez",
    email: "elizabeth.rodriguez@eduverse.com",
    level: "Sophomore",
    role: "student",
  },
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@eduverse.com",
    level: "PhD",
    role: "instructor",
  },
  {
    name: "Dr. Robert Lee",
    email: "robert.lee@eduverse.com",
    level: "PhD",
    role: "instructor",
  },
  {
    name: "Dr. Jennifer Walker",
    email: "jennifer.walker@eduverse.com",
    level: "PhD",
    role: "instructor",
  },
  {
    name: "Dr. David Hall",
    email: "david.hall@eduverse.com",
    level: "PhD",
    role: "instructor",
  },
  {
    name: "Dr. Lisa Allen",
    email: "lisa.allen@eduverse.com",
    level: "PhD",
    role: "instructor",
  },
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Check and create users
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User({
          ...userData,
          password: hashedPassword,
          courses: [],
        });
        await user.save();
        console.log(`Created user: ${userData.name}`);
      } else {
        console.log(`User already exists: ${userData.name}`);
      }
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`Total users in database: ${await User.countDocuments()}`);
    console.log("\nYou can login with any user using:");
    console.log("Email: [any email from above]");
    console.log("Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
