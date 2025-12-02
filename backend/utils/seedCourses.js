const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eduverse";

async function seedCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Find instructors
    const instructors = await User.find({ role: "instructor" });

    if (instructors.length === 0) {
      console.log("❌ No instructors found. Creating sample instructors...");

      // Create sample instructors
      const sampleInstructors = [
        {
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@eduverse.edu",
          password:
            "$2b$10$DY8Q2wSbP.REWYp8kbBSHONDpg3l/dapeQHbVtBKWTRlpwbNMeeqq", // password123
          level: "PhD in Computer Science",
          role: "instructor",
          courses: [],
        },
        {
          name: "Prof. Michael Chen",
          email: "michael.chen@eduverse.edu",
          password:
            "$2b$10$DY8Q2wSbP.REWYp8kbBSHONDpg3l/dapeQHbVtBKWTRlpwbNMeeqq",
          level: "Professor of Mathematics",
          role: "instructor",
          courses: [],
        },
        {
          name: "Prof. David Martinez",
          email: "david.martinez@eduverse.edu",
          password:
            "$2b$10$DY8Q2wSbP.REWYp8kbBSHONDpg3l/dapeQHbVtBKWTRlpwbNMeeqq",
          level: "Professor of Computer Science",
          role: "instructor",
          courses: [],
        },
      ];

      await User.insertMany(sampleInstructors);
      console.log(`✓ Created ${sampleInstructors.length} instructors`);

      // Refresh instructors list
      instructors.push(...(await User.find({ role: "instructor" })));
    }

    console.log(`\n📚 Found ${instructors.length} instructors`);

    // Delete existing courses
    await Course.deleteMany({});
    console.log("🗑️  Cleared existing courses");

    // Create courses
    const courses = [
      {
        _id: "CS101",
        name: "Introduction to Programming",
        creditHours: 3,
        description:
          "Learn the fundamentals of programming using Python. Perfect for beginners with no prior coding experience.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 60,
      },
      {
        _id: "CS201",
        name: "Data Structures",
        creditHours: 4,
        description:
          "Study fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 40,
      },
      {
        _id: "CS301",
        name: "Algorithms",
        creditHours: 4,
        description:
          "Advanced course covering algorithm design, analysis, sorting, searching, and optimization techniques.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 35,
      },
      {
        _id: "CS202",
        name: "Web Development",
        creditHours: 3,
        description:
          "Build modern web applications using HTML, CSS, JavaScript, React, and Node.js.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 50,
      },
      {
        _id: "CS401",
        name: "Machine Learning",
        creditHours: 4,
        description:
          "Introduction to machine learning algorithms, neural networks, deep learning, and AI applications.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 30,
      },
      {
        _id: "MATH101",
        name: "Calculus I",
        creditHours: 4,
        description:
          "Introduction to differential calculus, limits, derivatives, and applications.",
        instructorId: [instructors[1]._id],
        enrolled: 0,
        capacity: 60,
      },
      {
        _id: "MATH201",
        name: "Calculus II",
        creditHours: 4,
        description:
          "Continuation of Calculus I, covering integration techniques, series, and sequences.",
        instructorId: [instructors[1]._id],
        enrolled: 0,
        capacity: 50,
      },
      {
        _id: "MATH301",
        name: "Linear Algebra",
        creditHours: 3,
        description:
          "Vector spaces, matrices, eigenvalues, eigenvectors, and linear transformations.",
        instructorId: [instructors[1]._id],
        enrolled: 0,
        capacity: 40,
      },
      {
        _id: "CS302",
        name: "Operating Systems",
        creditHours: 4,
        description:
          "Process management, memory management, file systems, concurrency, and system calls.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 35,
      },
      {
        _id: "CS402",
        name: "Computer Networks",
        creditHours: 3,
        description:
          "Network protocols, TCP/IP, routing, network security, and socket programming.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 30,
      },
      {
        _id: "CS203",
        name: "Database Systems",
        creditHours: 3,
        description:
          "Relational databases, SQL, NoSQL, database design, normalization, and optimization.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 40,
      },
      {
        _id: "ENG201",
        name: "Technical Writing",
        creditHours: 3,
        description:
          "Professional communication, documentation, technical reports, and presentations.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 30,
      },
      {
        _id: "CS303",
        name: "Software Engineering",
        creditHours: 3,
        description:
          "Software development lifecycle, design patterns, testing, and project management.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 45,
      },
      {
        _id: "CS403",
        name: "Artificial Intelligence",
        creditHours: 4,
        description:
          "Search algorithms, knowledge representation, expert systems, and AI applications.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 30,
      },
      {
        _id: "CS204",
        name: "Mobile App Development",
        creditHours: 3,
        description:
          "Build native and cross-platform mobile applications for iOS and Android.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 35,
      },
      {
        _id: "CS304",
        name: "Computer Graphics",
        creditHours: 3,
        description:
          "2D and 3D graphics, rendering techniques, animation, and visualization.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 30,
      },
      {
        _id: "CS404",
        name: "Cybersecurity",
        creditHours: 3,
        description:
          "Network security, cryptography, ethical hacking, and security best practices.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 35,
      },
      {
        _id: "MATH401",
        name: "Discrete Mathematics",
        creditHours: 3,
        description:
          "Logic, set theory, combinatorics, graph theory, and mathematical proofs.",
        instructorId: [instructors[1]._id],
        enrolled: 0,
        capacity: 40,
      },
      {
        _id: "CS205",
        name: "Cloud Computing",
        creditHours: 3,
        description:
          "Cloud platforms, distributed systems, microservices, and serverless architecture.",
        instructorId: [instructors[0]._id],
        enrolled: 0,
        capacity: 40,
      },
      {
        _id: "CS305",
        name: "Game Development",
        creditHours: 3,
        description:
          "Game design, physics engines, graphics programming, and interactive entertainment.",
        instructorId: [instructors[2]._id],
        enrolled: 0,
        capacity: 30,
      },
    ];

    await Course.insertMany(courses);
    console.log(`✓ Inserted ${courses.length} courses\n`);

    // Display summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ COURSE SEEDING COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total Courses: ${courses.length}`);
    console.log(`Total Instructors: ${instructors.length}`);
    console.log("\nCourses by Instructor:");
    instructors.forEach((instructor) => {
      const instructorCourses = courses.filter((c) =>
        c.instructorId.some((id) => id.equals(instructor._id))
      );
      console.log(`  ${instructor.name}: ${instructorCourses.length} courses`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  }
}

seedCourses();
