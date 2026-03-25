import React from 'react';
import LevelupItem from './LevelupItem';

const LevelupList = () => {
    return (
        <ul>
           <li>
            {<LevelupItem/>}
            </li> 
        </ul>
    );
};

export default LevelupList;