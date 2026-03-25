import React from 'react';

const NoticeItem = ({ Notice, onOpen }) => { 
    const { id, rank, title, writer, poster, category, date } = Notice;

    return (
        <tr>
            <td>{rank}</td>
            <td className='img'>
                <p>
                    <span 
                        style={{ fontWeight: 'bold', display: 'block', cursor: 'pointer', color: '#0066ff' }} 
                        onClick={() => onOpen(id)}
                    >
                        {title}
                    </span>
                    {writer}
                </p>
            </td>
            <td>{category}</td>
            <td>{date}</td>
    
        </tr>
    );
};

export default NoticeItem;
