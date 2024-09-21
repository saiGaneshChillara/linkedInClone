import React from 'react'

const PostAction = ({icon, text, onClick }) => {
  return (
    <button className='flext items-center' onClick={onClick}>
        <span className="mr-1">{icon}</span>
        <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

export default PostAction;