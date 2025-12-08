require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Course = require("../models/Course");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const File = require("../models/File");
const Reaction = require("../models/Reaction");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Chat.deleteMany({}),
      Message.deleteMany({}),
      File.deleteMany({}),
      Reaction.deleteMany({}),
    ]);

    const hashedPassword = await bcrypt.hash("password123", 10);

    const usersData = [
      {
        name: "Dr. Ahmed Hassan",
        email: "ahmed.hassan@gmail.com",
        password: hashedPassword,
        role: "instructor",
        level: "Professor",
        image: {},
        createdAt: new Date("2024-01-15"),
      },
      {
        name: "Dr. Sarah Mohamed",
        email: "sarah.mohamed@gmail.com",
        password: hashedPassword,
        role: "instructor",
        level: "Associate Professor",
        image: {},
        createdAt: new Date("2024-01-20"),
      },
      {
        name: "Dr. Ahmed Fahmy",
        email: "ahmed.fahmy@gmail.com",
        password: hashedPassword,
        role: "instructor",
        level: "Professor",
        image: {},
        createdAt: new Date("2024-01-01"),
      },
      {
        name: "Omar Khaled",
        email: "omar.khaled@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Junior",
        image: {},
        createdAt: new Date("2024-02-01"),
      },
      {
        name: "Fatima Ali",
        email: "fatima.ali@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Senior",
        image: {},
        createdAt: new Date("2024-02-05"),
      },
      {
        name: "Youssef Ibrahim",
        email: "youssef.ibrahim@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Sophomore",
        image: {},
        createdAt: new Date("2024-02-10"),
      },
      {
        name: "Nour Ahmed",
        email: "nour.ahmed@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Junior",
        image: {},
        createdAt: new Date("2024-02-15"),
      },
      {
        name: "Mohamed Samir",
        email: "mohamed.samir@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Freshman",
        image: {},
        createdAt: new Date("2024-03-01"),
      },
      {
        name: "Layla Mahmoud",
        email: "layla.mahmoud@gmail.com",
        password: hashedPassword,
        role: "student",
        level: "Senior",
        image: {},
        createdAt: new Date("2024-03-05"),
      },
      {
        name: "Dr. Karim Nasser",
        email: "karim.nasser@gmail.com",
        password: hashedPassword,
        role: "instructor",
        level: "Assistant Professor",
        image: {},
        createdAt: new Date("2024-01-25"),
      },
    ];

    console.log("Inserting dummy data...");
    const users = await User.insertMany(usersData);
    console.log(`✓ Inserted ${users.length} users`);

    const userMap = {};
    users.forEach((user) => {
      userMap[user.name] = user._id;
    });

    const coursesData = [
      {
        _id: "CS101",
        name: "Introduction to Computer Science",
        creditHours: 3,
        description:
          "Fundamental concepts of programming, algorithms, and computational thinking.",
        instructorId: [userMap["Dr. Ahmed Hassan"]],
        enrolled: 45,
        capacity: 50,
      },
      {
        _id: "CS201",
        name: "Data Structures and Algorithms",
        creditHours: 4,
        description:
          "Advanced data structures including trees, graphs, and algorithm analysis.",
        instructorId: [userMap["Dr. Ahmed Hassan"]],
        enrolled: 38,
        capacity: 40,
      },
      {
        _id: "CS301",
        name: "Software Engineering",
        creditHours: 3,
        description:
          "Software development lifecycle, design patterns, and project management.",
        instructorId: [userMap["Dr. Ahmed Hassan"]],
        enrolled: 30,
        capacity: 35,
      },
      {
        _id: "DB101",
        name: "Database Fundamentals",
        creditHours: 3,
        description:
          "Introduction to relational databases, SQL, and database design principles.",
        instructorId: [userMap["Dr. Sarah Mohamed"]],
        enrolled: 42,
        capacity: 45,
      },
      {
        _id: "DB201",
        name: "Advanced Database Systems",
        creditHours: 4,
        description:
          "NoSQL databases, distributed systems, and database optimization.",
        instructorId: [userMap["Dr. Sarah Mohamed"]],
        enrolled: 25,
        capacity: 30,
      },
      {
        _id: "WEB101",
        name: "Web Development Fundamentals",
        creditHours: 3,
        description: "HTML, CSS, JavaScript, and responsive web design basics.",
        instructorId: [userMap["Dr. Karim Nasser"]],
        enrolled: 50,
        capacity: 50,
      },
      {
        _id: "MOB101",
        name: "Mobile Application Development",
        creditHours: 3,
        description:
          "Building mobile apps using React Native and cross-platform development.",
        instructorId: [userMap["Dr. Karim Nasser"]],
        enrolled: 35,
        capacity: 40,
      },
      {
        _id: "AI101",
        name: "Introduction to Artificial Intelligence",
        creditHours: 4,
        description:
          "Machine learning basics, neural networks, and AI applications.",
        instructorId: [userMap["Dr. Ahmed Hassan"]],
        enrolled: 40,
        capacity: 45,
      },
      {
        _id: "SEC101",
        name: "Cybersecurity Fundamentals",
        creditHours: 3,
        description:
          "Network security, cryptography, and ethical hacking basics.",
        instructorId: [userMap["Dr. Ahmed Fahmy"]],
        enrolled: 28,
        capacity: 35,
      },
      {
        _id: "NET101",
        name: "Computer Networks",
        creditHours: 3,
        description:
          "Network protocols, architecture, and communication systems.",
        instructorId: [userMap["Dr. Ahmed Fahmy"]],
        enrolled: 32,
        capacity: 40,
      },
    ];

    const courses = await Course.insertMany(coursesData);
    console.log(`✓ Inserted ${courses.length} courses`);

    const filesData = [
      {
        fileName: "CS101_Syllabus.pdf",
        fileType: "pdf",
        fileData: Buffer.from("CS101 Syllabus"),
        fileSize: 1024,
        createdAt: new Date("2024-09-01"),
      },
      {
        fileName: "DB101_Project_Guidelines.pdf",
        fileType: "pdf",
        fileData: Buffer.from("DB Project Guidelines"),
        fileSize: 2048,
        createdAt: new Date("2024-09-05"),
      },
      {
        fileName: "Ethical_Hacking_Resources.pdf",
        fileType: "pdf",
        fileData: Buffer.from("Ethical Hacking Resources"),
        fileSize: 512,
        createdAt: new Date("2024-10-12"),
      },
      {
        fileName: "MongoDB_Setup_Guide.pdf",
        fileType: "pdf",
        fileData: Buffer.from("MongoDB Setup Guide"),
        fileSize: 4096,
        createdAt: new Date("2024-10-18"),
      },
      {
        fileName: "React_Native_Resources.pdf",
        fileType: "pdf",
        fileData: Buffer.from("React Native Resources"),
        fileSize: 1024,
        createdAt: new Date("2024-10-16"),
      },
      {
        fileName: "Project_Proposal_Feedback.docx",
        fileType: "word",
        fileData: Buffer.from("Project Feedback"),
        fileSize: 2048,
        createdAt: new Date("2024-10-12"),
      },
      {
        fileName: "Lecture_Slides_Week1.pdf",
        fileType: "pdf",
        fileData: Buffer.from("Week 1 Slides"),
        fileSize: 3072,
        createdAt: new Date("2024-09-02"),
      },
      {
        fileName: "Assignment1_Template.docx",
        fileType: "word",
        fileData: Buffer.from("Assignment Template"),
        fileSize: 1024,
        createdAt: new Date("2024-09-15"),
      },
      {
        fileName: "Course_Banner.png",
        fileType: "image",
        fileData: Buffer.from("Course Banner"),
        fileSize: 5120,
        createdAt: new Date("2024-09-01"),
      },
      {
        fileName: "ER_Diagram_Example.png",
        fileType: "image",
        fileData: Buffer.from("ER Diagram"),
        fileSize: 1536,
        createdAt: new Date("2024-09-20"),
      },
    ];
    const files = await File.insertMany(filesData);
    console.log(`✓ Inserted ${files.length} files`);

    const postsData = [
      {
        sender: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        courseId: "CS101",
        title: "Welcome to Introduction to Computer Science!",
        body: "Welcome everyone to CS101! This semester we will cover programming fundamentals, algorithms, and computational thinking.",
        attachmentsId: [files[0]._id],
        type: "announcement",
        deadline: new Date("2024-09-15"),
        createdAt: new Date("2024-09-01"),
      },
      {
        sender: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        courseId: "CS101",
        title: "Question about Assignment 1",
        body: "I'm having trouble understanding the recursion problem in assignment 1. Can someone explain the base case concept?",
        attachmentsId: [],
        type: "question",
        createdAt: new Date("2024-09-10"),
      },
      {
        sender: {
          id: userMap["Dr. Sarah Mohamed"],
          name: "Dr. Sarah Mohamed",
          image: {},
        },
        courseId: "DB101",
        title: "Database Project Guidelines",
        body: "The final project requirements have been posted. You will design a complete database system for a real-world application.",
        attachmentsId: [files[1]._id],
        type: "announcement",
        deadline: new Date("2024-12-01"),
        createdAt: new Date("2024-09-05"),
      },
      {
        sender: { id: userMap["Nour Ahmed"], name: "Nour Ahmed", image: {} },
        courseId: "DB101",
        title: "Study Group for Midterm",
        body: "Anyone interested in forming a study group for the upcoming midterm? We can meet at the library or online.",
        attachmentsId: [],
        type: "discussion",
        createdAt: new Date("2024-10-01"),
      },
      {
        sender: {
          id: userMap["Dr. Karim Nasser"],
          name: "Dr. Karim Nasser",
          image: {},
        },
        courseId: "WEB101",
        title: "Web Development Workshop",
        body: "Join us for a hands-on workshop on React.js! We'll build a complete web application from scratch.",
        attachmentsId: [],
        type: "discussion",
        createdAt: new Date("2024-10-05"),
      },
      {
        sender: { id: userMap["Fatima Ali"], name: "Fatima Ali", image: {} },
        courseId: "CS301",
        title: "Design Patterns Clarification",
        body: "Can someone explain the difference between Factory and Abstract Factory patterns?",
        attachmentsId: [],
        type: "question",
        createdAt: new Date("2024-10-08"),
      },
      {
        sender: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        courseId: "AI101",
        title: "Guest Lecture: AI in Healthcare",
        body: "We have a special guest lecture next week from Dr. Smith discussing applications of AI in healthcare.",
        attachmentsId: [],
        type: "discussion",
        createdAt: new Date("2024-10-10"),
      },
      {
        sender: {
          id: userMap["Layla Mahmoud"],
          name: "Layla Mahmoud",
          image: {},
        },
        courseId: "SEC101",
        title: "Ethical Hacking Resources",
        body: "I found some great resources for practicing ethical hacking. Sharing for anyone interested!",
        attachmentsId: [files[2]._id],
        type: "discussion",
        createdAt: new Date("2024-10-12"),
      },
      {
        sender: {
          id: userMap["Youssef Ibrahim"],
          name: "Youssef Ibrahim",
          image: {},
        },
        courseId: "MOB101",
        title: "React Native vs Flutter?",
        body: "For our final project, should we use React Native or Flutter? What are the pros and cons?",
        attachmentsId: [],
        type: "question",
        createdAt: new Date("2024-10-15"),
      },
      {
        sender: {
          id: userMap["Dr. Sarah Mohamed"],
          name: "Dr. Sarah Mohamed",
          image: {},
        },
        courseId: "DB201",
        title: "MongoDB Workshop Announcement",
        body: "Important: We will have a hands-on MongoDB workshop. Please install MongoDB locally before attending.",
        attachmentsId: [files[3]._id],
        type: "announcement",
        deadline: new Date("2024-11-01"),
        createdAt: new Date("2024-10-18"),
      },
    ];
    const posts = await Post.insertMany(postsData);
    console.log(`✓ Inserted ${posts.length} posts`);

    const commentsData = [
      {
        postId: posts[1]._id,
        sender: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        body: "Great question Omar! The base case is the condition that stops the recursion.",
        createdAt: new Date("2024-09-10T14:30:00"),
      },
      {
        postId: posts[1]._id,
        sender: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        body: "Thank you Dr. Hassan! So for factorial, the base case would be when n equals 0 or 1?",
        createdAt: new Date("2024-09-10T15:00:00"),
      },
      {
        postId: posts[1]._id,
        sender: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        body: "Exactly! You've got it.",
        createdAt: new Date("2024-09-10T15:15:00"),
      },
      {
        postId: posts[3]._id,
        sender: { id: userMap["Fatima Ali"], name: "Fatima Ali", image: {} },
        body: "I'm interested! I can help with the normalization topics.",
        createdAt: new Date("2024-10-01T16:00:00"),
      },
      {
        postId: posts[3]._id,
        sender: { id: userMap["Nour Ahmed"], name: "Nour Ahmed", image: {} },
        body: "How about Saturday at 2 PM? We can use the study room.",
        createdAt: new Date("2024-10-01T17:00:00"),
      },
      {
        postId: posts[5]._id,
        sender: {
          id: userMap["Layla Mahmoud"],
          name: "Layla Mahmoud",
          image: {},
        },
        body: "Factory creates objects of a single type, while Abstract Factory creates families of related objects!",
        createdAt: new Date("2024-10-08T10:30:00"),
      },
      {
        postId: posts[8]._id,
        sender: {
          id: userMap["Dr. Karim Nasser"],
          name: "Dr. Karim Nasser",
          image: {},
        },
        body: "Both are excellent! React Native is great if you know JavaScript. For this course, I recommend React Native.",
        createdAt: new Date("2024-10-15T11:00:00"),
      },
      {
        postId: posts[8]._id,
        sender: {
          id: userMap["Youssef Ibrahim"],
          name: "Youssef Ibrahim",
          image: {},
        },
        body: "Thanks Dr. Nasser! I'll go with React Native then.",
        createdAt: new Date("2024-10-15T12:00:00"),
      },
      {
        postId: posts[4]._id,
        sender: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        body: "This sounds amazing! Will we need to bring our own laptops?",
        createdAt: new Date("2024-10-05T14:00:00"),
      },
      {
        postId: posts[4]._id,
        sender: {
          id: userMap["Dr. Karim Nasser"],
          name: "Dr. Karim Nasser",
          image: {},
        },
        body: "Yes, please bring your laptops with Node.js and VS Code installed.",
        createdAt: new Date("2024-10-05T15:00:00"),
      },
    ];
    const comments = await Comment.insertMany(commentsData);
    console.log(`✓ Inserted ${comments.length} comments`);

    const chatsData = [
      {
        user1: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        user2: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        lastMessage: "Thank you for the clarification!",
        updatedAt: new Date("2024-10-15T10:30:00"),
      },
      {
        user1: { id: userMap["Fatima Ali"], name: "Fatima Ali", image: {} },
        user2: { id: userMap["Nour Ahmed"], name: "Nour Ahmed", image: {} },
        lastMessage: "See you at the library tomorrow!",
        updatedAt: new Date("2024-10-14T18:00:00"),
      },
      {
        user1: {
          id: userMap["Youssef Ibrahim"],
          name: "Youssef Ibrahim",
          image: {},
        },
        user2: {
          id: userMap["Dr. Karim Nasser"],
          name: "Dr. Karim Nasser",
          image: {},
        },
        lastMessage: "I'll check those resources. Thanks!",
        updatedAt: new Date("2024-10-16T09:00:00"),
      },
      {
        user1: {
          id: userMap["Layla Mahmoud"],
          name: "Layla Mahmoud",
          image: {},
        },
        user2: { id: userMap["Fatima Ali"], name: "Fatima Ali", image: {} },
        lastMessage: "The cybersecurity workshop was great!",
        updatedAt: new Date("2024-10-13T16:45:00"),
      },
      {
        user1: {
          id: userMap["Mohamed Samir"],
          name: "Mohamed Samir",
          image: {},
        },
        user2: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        lastMessage: "Can you help me with the Python assignment?",
        updatedAt: new Date("2024-10-17T11:20:00"),
      },
      {
        user1: {
          id: userMap["Dr. Sarah Mohamed"],
          name: "Dr. Sarah Mohamed",
          image: {},
        },
        user2: { id: userMap["Nour Ahmed"], name: "Nour Ahmed", image: {} },
        lastMessage: "Your project proposal looks promising!",
        updatedAt: new Date("2024-10-12T14:00:00"),
      },
      {
        user1: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        user2: {
          id: userMap["Dr. Sarah Mohamed"],
          name: "Dr. Sarah Mohamed",
          image: {},
        },
        lastMessage: "Let's discuss the AI course collaboration.",
        updatedAt: new Date("2024-10-18T08:30:00"),
      },
      {
        user1: { id: userMap["Omar Khaled"], name: "Omar Khaled", image: {} },
        user2: {
          id: userMap["Youssef Ibrahim"],
          name: "Youssef Ibrahim",
          image: {},
        },
        lastMessage: "The group project is coming along nicely!",
        updatedAt: new Date("2024-10-16T20:15:00"),
      },
      {
        user1: {
          id: userMap["Dr. Ahmed Fahmy"],
          name: "Dr. Ahmed Fahmy",
          image: {},
        },
        user2: {
          id: userMap["Dr. Ahmed Hassan"],
          name: "Dr. Ahmed Hassan",
          image: {},
        },
        lastMessage: "The new course has been approved.",
        updatedAt: new Date("2024-10-10T09:00:00"),
      },
      {
        user1: { id: userMap["Fatima Ali"], name: "Fatima Ali", image: {} },
        user2: {
          id: userMap["Layla Mahmoud"],
          name: "Layla Mahmoud",
          image: {},
        },
        lastMessage: "Good luck on your presentation!",
        updatedAt: new Date("2024-10-19T22:00:00"),
      },
    ];
    const chats = await Chat.insertMany(chatsData);
    console.log(`✓ Inserted ${chats.length} chats`);

    const messagesData = [
      {
        senderId: userMap["Omar Khaled"],
        receiverId: userMap["Dr. Ahmed Hassan"],
        text: "Hello Dr. Hassan, I have a question about the recursion lecture.",
        createdAt: new Date("2024-10-15T10:00:00"),
      },
      {
        senderId: userMap["Dr. Ahmed Hassan"],
        receiverId: userMap["Omar Khaled"],
        text: "Of course Omar, what would you like to know?",
        createdAt: new Date("2024-10-15T10:15:00"),
      },
      {
        senderId: userMap["Omar Khaled"],
        receiverId: userMap["Dr. Ahmed Hassan"],
        text: "Thank you for the clarification!",
        createdAt: new Date("2024-10-15T10:30:00"),
      },
      {
        senderId: userMap["Fatima Ali"],
        receiverId: userMap["Nour Ahmed"],
        text: "Hey Nour! Are we still meeting for the study group?",
        createdAt: new Date("2024-10-14T17:30:00"),
      },
      {
        senderId: userMap["Nour Ahmed"],
        receiverId: userMap["Fatima Ali"],
        text: "See you at the library tomorrow!",
        createdAt: new Date("2024-10-14T18:00:00"),
      },
      {
        senderId: userMap["Youssef Ibrahim"],
        receiverId: userMap["Dr. Karim Nasser"],
        text: "Dr. Nasser, could you recommend some React Native tutorials?",
        createdAt: new Date("2024-10-16T08:30:00"),
      },
      {
        senderId: userMap["Dr. Karim Nasser"],
        receiverId: userMap["Youssef Ibrahim"],
        text: "Check out the official React Native docs and Udemy courses.",
        attachmentsId: [files[4]._id],
        createdAt: new Date("2024-10-16T08:45:00"),
      },
      {
        senderId: userMap["Youssef Ibrahim"],
        receiverId: userMap["Dr. Karim Nasser"],
        text: "I'll check those resources. Thanks!",
        createdAt: new Date("2024-10-16T09:00:00"),
      },
      {
        senderId: userMap["Mohamed Samir"],
        receiverId: userMap["Omar Khaled"],
        text: "Can you help me with the Python assignment?",
        createdAt: new Date("2024-10-17T11:20:00"),
      },
      {
        senderId: userMap["Dr. Sarah Mohamed"],
        receiverId: userMap["Nour Ahmed"],
        text: "Your project proposal looks promising!",
        attachmentsId: [files[5]._id],
        createdAt: new Date("2024-10-12T14:00:00"),
      },
    ];
    const messages = await Message.insertMany(messagesData);
    console.log(`✓ Inserted ${messages.length} messages`);

    const reactionsData = [
      {
        postId: posts[0]._id,
        senderId: userMap["Omar Khaled"],
        type: "like",
        createdAt: new Date("2024-09-01T12:00:00"),
      },
      {
        postId: posts[0]._id,
        senderId: userMap["Youssef Ibrahim"],
        type: "love",
        createdAt: new Date("2024-09-01T13:00:00"),
      },
      {
        postId: posts[0]._id,
        senderId: userMap["Mohamed Samir"],
        type: "like",
        createdAt: new Date("2024-09-01T14:00:00"),
      },
      {
        postId: posts[2]._id,
        senderId: userMap["Nour Ahmed"],
        type: "like",
        createdAt: new Date("2024-09-05T16:00:00"),
      },
      {
        postId: posts[4]._id,
        senderId: userMap["Omar Khaled"],
        type: "love",
        createdAt: new Date("2024-10-05T15:00:00"),
      },
      {
        postId: posts[4]._id,
        senderId: userMap["Youssef Ibrahim"],
        type: "love",
        createdAt: new Date("2024-10-05T16:00:00"),
      },
      {
        postId: posts[6]._id,
        senderId: userMap["Fatima Ali"],
        type: "shocked",
        createdAt: new Date("2024-10-10T11:00:00"),
      },
      {
        postId: posts[6]._id,
        senderId: userMap["Layla Mahmoud"],
        type: "love",
        createdAt: new Date("2024-10-10T12:00:00"),
      },
      {
        postId: posts[7]._id,
        senderId: userMap["Fatima Ali"],
        type: "like",
        createdAt: new Date("2024-10-12T14:00:00"),
      },
      {
        postId: posts[1]._id,
        senderId: userMap["Mohamed Samir"],
        type: "laugh",
        createdAt: new Date("2024-09-10T16:00:00"),
      },
    ];
    const reactions = await Reaction.insertMany(reactionsData);
    console.log(`✓ Inserted ${reactions.length} reactions`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nYou can login with any user using:");
    console.log("Email: [any email from above]");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

seedDatabase();
