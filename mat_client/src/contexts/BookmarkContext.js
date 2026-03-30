import { createContext, useContext, useEffect, useState } from 'react';
import * as bookmarkService from '../services/bookmarkService';

const BookmarkContext = createContext();

//다른 파일에서 어디서든 사용하게끔 프로바이더 생성
export const BookmarkProvider = ({children, loginUser}) => {
    const [bookmarks, setBookmarks] = useState([]);

    const fetchBookmarks = async() => {
        console.log("fetchBookmarks 실행, loginUser:", loginUser);
        try {
            const res = await bookmarkService.getBookmarks(loginUser);
            console.log("북마크 응답:", res);
            setBookmarks(res); //해당 유저의 북마크 불러서 담기
        } catch (err) {
            console.error(err);
            setBookmarks([]);
        }
    };

    //북마크 삭제
    const onDel = async (item) => {
        await bookmarkService.deleteBookmark(item._id);
        fetchBookmarks(); //삭제후 불러오기
    }
    //로그인 유저 바뀔때마다 갱신
    useEffect(() => {
        if (loginUser) fetchBookmarks();
    },[loginUser]);
    
    return (
        <BookmarkContext.Provider value={{bookmarks, fetchBookmarks, onDel}}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmark = () => useContext(BookmarkContext); //커스텀 훅