import React from 'react';
import MyhomeItem from './MyhomeItem';

const MyhomeList = () => {
    return (
        <ul>
            <li>
            {
                <MyhomeItem/>
            }
            </li>
        </ul>
    );
};

export default MyhomeList;