import React, { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { FiTrash } from 'react-icons/fi';

function BurnBarrel({ setCards }) {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');
        setCards((pv) => pv.filter((c) => c.id !== cardId));
        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={active ? 'remove-card active' : 'remove-card'}
        >
            {active ? <FaFire className='remove-icon' /> : <FiTrash />}
        </div>
    );
}

export default BurnBarrel;
