import React from 'react';
import NoticeItem from './NoticeItem';

const NoticeList = ({ Notices, onLike, onOpen, onDel }) => { 
    return (
        <div className='NoticeList'>
            <table>
                
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>카테고리</th>
                        <th>날짜</th>
                        {/* <th>관리</th>  */}
                    </tr>
                </thead>
                
                <tbody>
                    {
                        Notices && Notices.map(item => (
                            <NoticeItem key={item._id} Notice={item} onLike={onLike} 
                                onOpen={() => onOpen(item._id)} onDel={() => onDel(item._id)} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default NoticeList;
