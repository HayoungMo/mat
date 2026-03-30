import { useBookmark } from "../../contexts/BookmarkContext";




const UserMyPageBookmarkItem = ({item, onSelectPlace}) => {
    const {onDel} = useBookmark();
    const {matName, matTel, matAddr, lat, lng} = item;

   

    return (
        <div>
            <div onClick={() => onSelectPlace({matName, matTel, matAddr, lat,   lng})} 
                style={{cursor:'pointer'}}>
                <td>{matName}</td>
                <td>{matTel}</td>
                <td>{matAddr}</td>
            </div>
                <td>
                    <button onClick={(e) => {
                    e.stopPropagation(); // 👈 tr 클릭 방지
                    onDel(item);
                    }}>삭제</button>
                </td>
        </div>
    );
};

export default UserMyPageBookmarkItem;