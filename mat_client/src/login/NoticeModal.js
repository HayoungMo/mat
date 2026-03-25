import React from 'react';

const NoticeModal = ({NoticeNum,onClose}) => {

    const {title,writer,key} = NoticeNum

    return (
        <div className='Modal'>
            <div className='bg'></div>
            <div className='popup'>
                <h2>제목: {title}</h2>
                <p>작성자: {writer}</p>
            </div>

        </div>
    );
};

export default NoticeModal;