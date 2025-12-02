import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Card, Avatar, AvatarFallback } from "../components/ui/display";
import { Button } from "../components/ui/button";
import { Send, Paperclip, X, Image as ImageIcon, FileText } from "lucide-react";
import { getSession } from "../api/session";
import { getAllChats } from "../api/chats";
import { getMessages, sendMessage } from "../api/messages";
import { uploadFile, getFileUrl } from "../api/files";
import { getInitials, formatRelativeTime } from "../lib/utils";
import { toast } from "sonner";
import "../styles/chats.css";

const Chats = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
      loadChats();
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [messageText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const loadChats = async () => {
    try {
      const data = await getAllChats();
      // Handle both old format (array) and new format (object with chats array)
      setChats(data.chats || data);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setLoading(true);
      const data = await getMessages(chatId);
      setMessages(data);
      // Scroll to bottom after messages load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 10MB limit`);
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported file type`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() && selectedFiles.length === 0) {
      return;
    }

    if (!activeChat) {
      toast.error("Please select a chat");
      return;
    }

    try {
      setUploading(true);

      // Upload files first
      const uploadedFileIds = [];
      for (const file of selectedFiles) {
        const uploadedFile = await uploadFile(file);
        uploadedFileIds.push(uploadedFile._id);
      }

      // Get receiver ID
      const receiverId =
        activeChat.user1.id === user._id
          ? activeChat.user2.id
          : activeChat.user1.id;

      // Send message
      const newMessage = await sendMessage(
        activeChat._id,
        receiverId,
        messageText || "📎 Attachment",
        uploadedFileIds
      );

      // Add message to list
      setMessages((prev) => [...prev, newMessage]);

      // Update chat's last message and move to top
      setChats((prev) => {
        const updatedChat = prev.find((chat) => chat._id === activeChat._id);
        if (updatedChat) {
          const otherChats = prev.filter((chat) => chat._id !== activeChat._id);
          return [
            {
              ...updatedChat,
              lastMessage: messageText || "📎 Attachment",
              updatedAt: new Date().toISOString(),
            },
            ...otherChats,
          ];
        }
        return prev;
      });

      // Clear inputs
      setMessageText("");
      setSelectedFiles([]);

      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setUploading(false);
    }
  };

  const getOtherUser = (chat) => {
    if (!user) return null;
    return chat.user1.id === user._id ? chat.user2 : chat.user1;
  };

  return (
    <div className="chats-page">
      <Navbar user={user} />
      <div className="chats-container">
        <div className="chats-layout">
          {/* Chat List */}
          <div className="chat-list">
            <Card className="chat-list-card">
              <div className="chat-list-header">
                <h2 className="chat-list-title">Messages</h2>
              </div>
              <div className="chat-list-content">
                {chats.length === 0 ? (
                  <div className="empty-chats">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    return (
                      <div
                        key={chat._id}
                        className={`chat-item ${
                          activeChat?._id === chat._id ? "chat-item-active" : ""
                        }`}
                        onClick={() => setActiveChat(chat)}
                      >
                        <Avatar>
                          <AvatarFallback className="avatar-fallback-primary">
                            {getInitials(otherUser?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="chat-item-content">
                          <div className="chat-item-header">
                            <span className="chat-item-name">
                              {otherUser?.name}
                            </span>
                            <span className="chat-item-time">
                              {formatRelativeTime(chat.updatedAt || new Date())}
                            </span>
                          </div>
                          <div className="chat-item-message">
                            <span className="chat-item-text">
                              {chat.lastMessage || "No messages yet"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="chat-window">
            {activeChat ? (
              <Card className="chat-window-card">
                <div className="chat-window-header">
                  <Avatar>
                    <AvatarFallback className="avatar-fallback-primary">
                      {getInitials(getOtherUser(activeChat)?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="chat-window-user">
                    <h3 className="chat-window-name">
                      {getOtherUser(activeChat)?.name}
                    </h3>
                  </div>
                </div>

                <div
                  className={`chat-messages ${isDragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="drag-overlay">
                      <div className="drag-content">
                        <ImageIcon size={48} />
                        <p>Drop files here to upload</p>
                      </div>
                    </div>
                  )}

                  {loading ? (
                    <div className="loading-messages">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="empty-messages">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message ${
                          message.senderId === user._id
                            ? "message-me"
                            : "message-other"
                        }`}
                      >
                        {message.senderId !== user._id && (
                          <Avatar className="message-avatar">
                            <AvatarFallback className="avatar-fallback-secondary">
                              {getInitials(
                                getOtherUser(activeChat)?.name || "U"
                              )}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="message-content">
                          <div className="message-bubble">
                            {message.attachmentsId &&
                              message.attachmentsId.length > 0 && (
                                <div className="message-attachments">
                                  {message.attachmentsId.map((fileId) => {
                                    const fileUrl = getFileUrl(fileId);

                                    // Try to display as image first
                                    return (
                                      <div key={fileId}>
                                        <div className="message-image-container">
                                          <img
                                            src={fileUrl}
                                            alt="Attachment"
                                            className="message-image"
                                            onClick={() =>
                                              window.open(fileUrl, "_blank")
                                            }
                                            onError={(e) => {
                                              // If image fails to load, show download link instead
                                              e.target.style.display = "none";
                                              e.target.nextSibling.style.display =
                                                "flex";
                                            }}
                                          />
                                          <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="message-attachment"
                                            style={{ display: "none" }}
                                          >
                                            <FileText size={16} />
                                            <span>View attachment</span>
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            {message.text &&
                              message.text !== "📎 Attachment" && (
                                <p className="message-text">{message.text}</p>
                              )}
                          </div>
                          <span className="message-time">
                            {formatRelativeTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                  {selectedFiles.length > 0 && (
                    <div className="selected-files">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="selected-file">
                          <div className="file-info">
                            {file.type.startsWith("image/") ? (
                              <ImageIcon size={16} />
                            ) : (
                              <FileText size={16} />
                            )}
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="remove-file"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={handleSendMessage}
                    className="chat-input-form"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="attach-button"
                      disabled={uploading}
                    >
                      <Paperclip className="attach-icon" />
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type a message..."
                      className="chat-input-textarea"
                      rows={1}
                      disabled={uploading}
                    />
                    <Button
                      type="submit"
                      className="send-button"
                      disabled={
                        uploading ||
                        (!messageText.trim() && selectedFiles.length === 0)
                      }
                    >
                      <Send className="send-icon" />
                    </Button>
                  </form>
                </div>
              </Card>
            ) : (
              <Card className="chat-empty">
                <div className="chat-empty-content">
                  <h3 className="chat-empty-title">Select a conversation</h3>
                  <p className="chat-empty-text">
                    Choose a chat from the list to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
