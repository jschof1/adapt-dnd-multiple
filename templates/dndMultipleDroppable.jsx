import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';
import { Droppable } from './libraries/react-beautiful-dnd.min.js';

export default function DndMultipleDroppable({
  col: { _isCorrect, _options, droppableId, title },
  width,
  isEnabled,
  _allOptions,
  _globals
}) {
  const minHeight =
    droppableId === '0' ? 'auto' : `${_allOptions.length * 4}rem`;
  return (
    <>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            className={classes([
              'dnd-multiple__items',
              `dnd-multiple__items-${droppableId}`,
              _options.length === 0 && 'is-empty',
              _isCorrect && 'is-correct',
              !_isCorrect && _isCorrect !== undefined && 'is-incorrect'
            ])}
            style={{ width }}
          >
            <div
              className='dnd-multiple__title'
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
            <div
              style={{ minHeight }}
              className='dnd-multiple__dropitem'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {_options.map((option, index) => (
                <templates.dndMultipleDraggable
                  key={option.id}
                  title={option.title}
                  _graphic={option._graphic}
                  index={index}
                  isEnabled={isEnabled}
                  isCorrect={option._isCorrect}
                  _globals={_globals}
                />
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </>
  );
}
