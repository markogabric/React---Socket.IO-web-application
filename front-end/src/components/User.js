import '../styles/user.css'
import React from 'react'
import UserAvatar from './UserAvatar.js'

function User({user, chatroomId}) {
    return (
        <div className="user">
            <UserAvatar color={user.color}>{user.username[0].toUpperCase()}</UserAvatar>
            <div className="userInfo">
                <span className="userUsername" style={{color:user.color}}>{user.username}</span>
                <span className="userPoints">Points: {user.points[chatroomId]}</span>
            </div>
        </div>
    )
}

export default User
