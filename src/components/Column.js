import React, { useState } from 'react';
import AddCard from './AddCard';
import DropIndicator from './DropIndicator';
import Card from './Card';

function Column({ title, headingColor, cards, column, setCards }) {
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
                <span className='column-length'>
                    cards: {filteredCards.length}
                </span>
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
}

export default Column;
