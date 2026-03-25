import React, { useState } from 'react';
import axios from 'axios';


const SearchPage = () => {

const [keyword,setKeyword] = useState('');
const [list, setList] = useState([]);

const onSearch = async () => {
    const res = await axios.get(`/api/article?keyword=${keyword}`);
    setList(res.data);
};

    return (
        <div>
            <input value={keyword} onChange={e => setKeyword(e.target.value)}/>
            <button onClick={onSearch}>검색</button>

            {list.map(item => (
                <div key={item._id}>{item.title}</div>
            ))}
        </div>
    );
};

export default SearchPage;
