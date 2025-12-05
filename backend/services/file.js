const File = require("../models/File");

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { courseId, postId, messageId } = req.body;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(415).json({
        error:
          "Unsupported file type. Only images, PDFs, and Word documents are allowed",
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(413).json({ error: "File size exceeds 10MB limit" });
    }

    // Determine file type
    let fileType = "image";
    if (req.file.mimetype === "application/pdf") {
      fileType = "pdf";
    } else if (
      req.file.mimetype === "application/msword" ||
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fileType = "word";
    }

    // Create file record
    const file = new File({
      fileName: req.file.originalname,
      fileType,
      fileData: req.file.buffer,
      courseId: courseId || null,
      postId: postId || null,
      messageId: messageId || null,
    });

    await file.save();

    res.status(201).json({
      _id: file._id,
      fileName: file.fileName,
      fileType: file.fileType,
      size: req.file.size,
      createdAt: file.createdAt,
    });
  } catch (error) {
    console.error("Upload file error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ error: "Server error during file upload: " + error.message });
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set content type
    let contentType = "application/octet-stream";
    if (file.fileType === "image") {
      contentType = "image/jpeg";
    } else if (file.fileType === "pdf") {
      contentType = "application/pdf";
    } else if (file.fileType === "word") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${file.fileName}"`,
    });

    res.send(file.fileData);
  } catch (error) {
    console.error("Download file error:", error);
    res.status(500).json({ error: "Server error during file download" });
  }
};

// Get files by course
const getFilesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const files = await File.find({ courseId }).select(
      "_id fileName fileType createdAt"
    );

    // Add size information (approximate from buffer length)
    const filesWithSize = files.map((file) => ({
      _id: file._id,
      fileName: file.fileName,
      fileType: file.fileType,
      createdAt: file.createdAt,
      size: file.fileData ? file.fileData.length : 0,
    }));

    res.json(filesWithSize);
  } catch (error) {
    console.error("Get files by course error:", error);
    res.status(500).json({ error: "Server error fetching files" });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Only allow instructors or file owner to delete
    if (req.userRole !== "instructor" && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ error: "Only instructors can delete files" });
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ error: "Server error during file deletion" });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  getFilesByCourse,
  deleteFile,
};
