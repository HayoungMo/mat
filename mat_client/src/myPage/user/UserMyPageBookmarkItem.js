import { useBookmark } from "../../contexts/BookmarkContext";
import './UserMyPage.css';



const UserMyPageBookmarkItem = ({item, onSelectPlace}) => {
    const {onDel} = useBookmark();
    const {matName, matTel, matAddr, lat, lng} = item;

   

    return (

            <tr onClick={() => onSelectPlace({matName, matTel, matAddr, lat,   lng})} 
                style={{cursor:'pointer'}}>
                <td>{matName}</td>
                <td>{matTel}</td>
                <td>{matAddr}</td>
            
                <td>
                    <button className="btn btn-primary" onClick={(e) => {
                    e.stopPropagation(); // 👈 tr 클릭 방지
                    onDel(item);
                    }}>삭제</button>
                </td>
                </tr>
        
    );
};

export default UserMyPageBookmarkItem;