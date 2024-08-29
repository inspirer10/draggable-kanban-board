import React from 'react';

function DropIndicator({ beforeId, column }) {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className='drop-indicator'
        />
    );
}
export default DropIndicator;
