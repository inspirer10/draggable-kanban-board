import React, { useState } from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

export const KanbanBoard = () => {
    return (
        <div className='board-container'>
            <Board />
        </div>
    );
};

const Board = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);

    return (
        <div className='columns-wrapper'>
            <Column
                title='Backlog'
                column='backlog'
                headingColor='rgb(115 115 115)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='TODO'
                column='todo'
                headingColor='rgb(254 240 138)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='In progress'
                column='doing'
                headingColor='rgb(191 219 254)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='Complete'
                column='done'
                headingColor='rgb(167 243 208)'
                cards={cards}
                setCards={setCards}
            />
            <BurnBarrel setCards={setCards} />
        </div>
    );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('cardId', card.id);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData('cardId');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || '-1';

        if (before !== cardId) {
            let copy = [...cards];
            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);
            const moveToBack = before === '-1';

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;
                copy.splice(insertAtIndex, 0, cardToTransfer);
            }
            setCards(copy);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();
        indicators.forEach((i) => {
            i.style.opacity = '0';
        });
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = '1';
    };

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );
        return el;
    };

    const getIndicators = () => {
        return Array.from(
            document.querySelectorAll(`[data-column="${column}"]`)
        );
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.column === column);

    return (
        <div className='column'>
            <div className='column-header'>
                <h3 className='column-title' style={{ color: headingColor }}>
                    {title}
                </h3>
                <span className='column-length'>{filteredCards.length}</span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={
                    active
                        ? 'column-draggable-space active'
                        : 'column-draggable-space '
                }
            >
                {filteredCards.map((c) => {
                    return (
                        <Card
                            key={c.id}
                            {...c}
                            handleDragStart={handleDragStart}
                        />
                    );
                })}
                <DropIndicator beforeId={null} column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    );
};

const Card = ({ title, id, column, handleDragStart }) => {
    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable='true'
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className='card'
            >
                <p className='card-text'>{title}</p>
            </motion.div>
        </>
    );
};

const DropIndicator = ({ beforeId, column }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-xcolumn={column}
            className='drop-indicator'
        />
    );
};

const BurnBarrel = ({ setCards }) => {
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
            className='remove-card'
        >
            {active ? <FaFire claxssName='animate-bounce' /> : <FiTrash />}
        </div>
    );
};

const AddCard = ({ column, setCards }) => {
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
                <motion.form layout onSubmit={handleSubmit}>
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
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className='add_button-card'
                >
                    <span>Add card</span>
                    <FiPlus />
                </motion.button>
            )}
        </>
    );
};

const DEFAULT_CARDS = [
    // BACKLOG
    { title: 'Look into render bug in dashboard', id: '1', column: 'backlog' },
    { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
    { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
    { title: 'Document Notifications service', id: '4', column: 'backlog' },
    // TODO
    {
        title: 'Research DB options for new microservice',
        id: '5',
        column: 'todo',
    },
    { title: 'Postmortem for outage', id: '6', column: 'todo' },
    { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },

    // DOING
    {
        title: 'Refactor context providers to use Zustand',
        id: '8',
        column: 'doing',
    },
    { title: 'Add logging to daily CRON', id: '9', column: 'doing' },
    // DONE
    {
        title: 'Set up DD dashboards for Lambda listener',
        id: '10',
        column: 'done',
    },
];
