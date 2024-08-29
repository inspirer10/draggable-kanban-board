import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

function AddCard({ column, setCards }) {
    const [text, setText] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        setCards((pv) => [...pv, newCard]);
        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder='Add new task...'
                        className='input-text'
                    />
                    <div className='buttons-wrapper'>
                        <button
                            onClick={() => setAdding(false)}
                            className='close_button'
                        >
                            Close
                        </button>
                        <button type='submit' className='add_button'>
                            <span>Add</span>
                            <FiPlus />
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    layout
                    onClick={() => setAdding(true)}
                    className='add_button-card'
                >
                    <span>Add card</span>
                    <FiPlus />
                </button>
            )}
        </>
    );
}

export default AddCard;
