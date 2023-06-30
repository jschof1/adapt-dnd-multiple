import React, { useState, useEffect } from 'react';
import { templates } from 'core/js/reactHelpers';

import { DragDropContext } from './libraries/react-beautiful-dnd.min.js';

export default function DndMultiple(props) {
  const { _isEnabled, _isCorrectAnswerShown, _items, _correctItems, setItems } =
    props;

  const [dragItems, setDragItems] = useState(_items);
  const countItems = Object.keys(dragItems).length;
  useEffect(() => {
    if (_isCorrectAnswerShown) {
      setDragItems(_correctItems);
    } else {
      if (!_isEnabled) {
        setDragItems(_items);
      }
    }
  }, [_isCorrectAnswerShown]);

  useEffect(() => {
    if (!_isEnabled) return null;

    setItems(dragItems);
  }, [dragItems]);

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return null;
    }

    const start = dragItems[source.droppableId];
    const end = dragItems[destination.droppableId];

    if (start === end) {
      const newList = start._options.filter((_, idx) => idx !== source.index);

      newList.splice(destination.index, 0, start._options[source.index]);

      const newCol = {
        id: start.id,
        droppableId: start.droppableId,
        title: start.title,
        _options: newList
      };

      setDragItems((state) => ({ ...state, [newCol.id]: newCol }));

      return null;
    } else {
      const newStartList = start._options.filter(
        (_, idx) => idx !== source.index
      );

      const newStartCol = {
        id: start.id,
        droppableId: start.droppableId,
        title: start.title,
        _options: newStartList
      };

      const newEndList = end._options;

      newEndList.splice(destination.index, 0, start._options[source.index]);

      const newEndCol = {
        id: end.id,
        droppableId: end.droppableId,
        title: end.title,
        _options: newEndList
      };

      setDragItems((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));

      return null;
    }
  };

  return (
    <div className='component__inner dnd-multiple__inner'>
      <templates.header {...props} />
      <div className='dnd-multiple__widget component__widget'>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(dragItems).map((col) => (
            <templates.dndMultipleDroppable
              {...props}
              col={col}
              key={col.id}
              width={`${100 / countItems}%`}
              isEnabled={_isEnabled}
            />
          ))}
        </DragDropContext>
      </div>
      <div className='btn__container'></div>
    </div>
  );
}
