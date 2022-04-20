import React from 'react'
import Avatar from '@material-ui/core/Avatar'

function UserAvatar(props) {
    return (
        <div>
            <Avatar style={{backgroundColor:props.color}}>{props.children}</Avatar>
        </div>
    )
}

export default UserAvatar
