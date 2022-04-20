import '../styles/message.css'
import React from 'react'
import UserAvatar from './UserAvatar.js'

function Message({children, username, time, color = 'var(--chatbot)', isAdmin = false}) {
    return (
        <div className="chatMessage">
        <UserAvatar color={color}>{isAdmin ? 'QB' : username[0].toUpperCase()}</UserAvatar>
        <div className="chatMessageContent">
            <div className="messageHeader">
                <span className={isAdmin ? "adminMessage": "userMessage"} style={{color:color}}>{username}</span>
                <span className="messageTime">{time}</span>
            </div>
            <div className="messageContent">{children}</div>
        </div>
        </div>
    )
}

export default Message
