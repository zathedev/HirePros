import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { SendHorizontal, Paperclip, MoreVertical, Search, CheckCheck, MessageSquare } from 'lucide-react';
import './Chat.css';

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [activeUserId, setActiveUserId] = useState(userId || null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('user_connected', user.id);
    socketRef.current.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socketRef.current.disconnect();
  }, [user.id]);

  useEffect(() => { fetchContacts(); }, []);

  useEffect(() => {
    if (activeUserId) {
      fetchMessages(activeUserId);
      fetchUserInfo(activeUserId);
    }
  }, [activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get('/api/messages/contacts/list');
      setContacts(data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (uid) => {
    try {
      const { data } = await axios.get(`/api/messages/${uid}`);
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  const fetchUserInfo = async (uid) => {
    try {
      const { data } = await axios.get(`/api/users/${uid}`);
      setActiveContact(data);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUserId) return;

    const msgData = {
      senderId: user.id,
      receiverId: activeUserId,
      text,
      createdAt: new Date().toISOString()
    };

    try {
      await axios.post('/api/messages', { receiverId: activeUserId, text });
      socketRef.current.emit('send_message', msgData);
      setMessages(prev => [...prev, { ...msgData, sender: user.id }]);
      setText('');
      fetchContacts();
    } catch (err) { console.error(err); }
  };

  const selectContact = (contactId) => {
    setActiveUserId(contactId);
    navigate(`/chat/${contactId}`);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Inbox</h2>
          <div className="search-contacts">
            <Search size={16} />
            <input type="text" placeholder="Search messages..." />
          </div>
        </div>
        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="no-contacts">No messages yet.</div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact._id}
                className={`contact-item ${activeUserId === contact._id ? 'active' : ''}`}
                onClick={() => selectContact(contact._id)}
              >
                <div className="avatar-wrapper">
                   <div className="contact-avatar">{contact.name[0]}</div>
                   <span className="online-indicator"></span>
                </div>
                <div className="contact-info">
                  <div className="contact-name-row">
                    <span className="name">{contact.name}</span>
                    <span className="time">Just now</span>
                  </div>
                  <div className="last-msg">Click to view conversation...</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {!activeUserId ? (
          <div className="chat-empty">
            <div className="empty-icon"><MessageSquare size={64} /></div>
            <h3>Select a conversation</h3>
            <p>Direct communication is the key to a great project.</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="header-left">
                <div className="contact-avatar small">{activeContact?.name?.[0]}</div>
                <div className="header-user-details">
                  <span className="user-name">{activeContact?.name || 'Loading...'}</span>
                  <span className="user-status">Online | {activeContact?.city}</span>
                </div>
              </div>
              <div className="header-right">
                <button className="icon-btn"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="messages-area">
              <div className="safety-tip">
                Tip: For your safety, keep all payments and communication within HirePros.
              </div>
              <div className="messages-list">
                {messages.map((msg, i) => {
                const isMine = (msg.sender === user.id || msg.sender?._id === user.id || msg.senderId === user.id);
                return (
                  <div key={i} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && <div className="contact-avatar mini">{activeContact?.name?.[0]}</div>}
                    <div className="message-container">
                      <div className="message-bubble">{msg.text}</div>
                      <div className="message-meta">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && <CheckCheck size={14} className="read-receipt" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
              <div className="input-controls">
                <button type="button" className="attach-btn"><Paperclip size={20} /></button>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type your message here..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                />
                <button type="submit" className="send-btn" disabled={!text.trim()}>
                  <SendHorizontal size={20} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}