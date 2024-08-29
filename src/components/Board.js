import React, { useState } from 'react';
import Column from './Column';
import BurnBarrel from './BurnBarrel';

const DEFAULT_CARDS = [
    //NOTE - BACKLOG
    { title: 'Praesent eget leo id enim tempus', id: '1', column: 'backlog' },
    {
        title: 'Nam suscipit vel nisl eu ullamcorper',
        id: '2',
        column: 'backlog',
    },
    { title: 'Duis sed purus in odio dignissim', id: '3', column: 'backlog' },
    {
        title: 'Sed ornare ligula quis lobortis dictum',
        id: '4',
        column: 'backlog',
    },
    /// TODO
    {
        title: 'Donec maximus, metus eget pulvinar egestas',
        id: '5',
        column: 'todo',
    },
    { title: 'Interdum et malesuada fames', id: '6', column: 'todo' },
    { title: 'Maecenas sed tristique nisi', id: '7', column: 'todo' },
    //! DOING
    {
        title: 'Donec finibus enim eget vulputate faucibus',
        id: '8',
        column: 'doing',
    },
    {
        title: 'Quisque ultrices finibus justo non scelerisque',
        id: '9',
        column: 'doing',
    },
    //? DONE
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adip',
        id: '10',
        column: 'done',
    },
];

function Board() {
    const [cards, setCards] = useState(DEFAULT_CARDS);

    return (
        <div className='columns-wrapper'>
            <Column
                title='Backlog'
                column='backlog'
                headingColor='rgb(120 120 120)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='TODO'
                column='todo'
                headingColor='rgb(250 225 0)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='In progress'
                column='doing'
                headingColor='rgb(15 200 250)'
                cards={cards}
                setCards={setCards}
            />
            <Column
                title='Completed'
                column='done'
                headingColor='rgb(0 250 0)'
                cards={cards}
                setCards={setCards}
            />
            <BurnBarrel setCards={setCards} />
        </div>
    );
}

export default Board;
