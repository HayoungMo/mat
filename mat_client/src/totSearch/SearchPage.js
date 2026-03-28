import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import SearchItem from './SearchItem';

const SearchPage = () => {

//사용자가 입력한 검색어
const [keyword,setKeyword] = useState('');
//API에서 받아온 목록
const [list, setList] = useState([]);


const onSearch = async () => {
    
    if(!keyword.trim()) {
        setList([]);
        return;
    }
    const res = await axios.get(`/api/article?keyword=${keyword}`);
    console.log(res.data);
    setList(res.data);
};

//keyword가 바뀔 때마다 실시간 검색
    useEffect(() => {
    
    if(!keyword.trim()) {
        setList([]);
        return;
    }
        //타이핑 멈추고 300ms 후에 검색
        const timer = setTimeout(onSearch, 300);
        return () => clearTimeout(timer);
        
    }, [keyword]);

return (
    <div>
            <SearchBar keyword={keyword} setKeyword={setKeyword} onSearch={onSearch}/>

            {list.map(item => (
                <SearchItem key={item._id} item={item}></SearchItem>
            ))}
        </div>
    );
};

export default SearchPage;

// //filter 대상 배열 list, filter 안에서 비교할 텍스트 : item.title(또는 실제 필드명), includes에 넣을 검색어 keyword
// const filterSearch = list.filter((item)=>{
//     //필터링한 대상은 api에서 받아온 list다.
//     return item.list.replace(" ","").toLocaleLowerCase().includes(list.toLocaleLowerCase().replace(" ",""));
//     //includes 함수는 배열의 특정 요소가 포함하는지 판별해주는 boolean 타입으로, 입력한 검색어를 true&false로 나눠준다. 그리고 이 함수는 대소문자를 인식하기때문에 to~~~case 함수로 입력값을 대소문자 동일 시켰다.
//     //replace를 사용해서 공백을 모두 지운후 띄어쓰기, 붙여쓰기해도 검색에 이상없게 만들었다.
//라우터에 걸러줄 코딩을 만들어뒀기때문에 필터는 피료없다.
// });