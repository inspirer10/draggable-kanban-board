import React from 'react';
import DropIndicator from './DropIndicator';

function Card({ title, id, column, handleDragStart }) {
    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <div
                layout
                layoutId={id}
                draggable='true'
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className='card'
            >
                <div className='card-content'>
                    <p className='card-text'>{title}</p>
                </div>
            </div>
        </>
    );
}

export default Card;
