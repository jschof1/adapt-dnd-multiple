import { Draggable } from './libraries/react-beautiful-dnd.min.js';
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';
export default function DndMultipleDragable({
  title,
  _graphic,
  index,
  isEnabled,
  isCorrect,
  _globals
}) {
  const DragItemGraphic = () => {
    if (_graphic.isBackground) {
      return (
        <div
          className='dnd-multiple__dragitem__image-container'
          style={{
            backgroundImage: `url(${_graphic.src})`
          }}
        ></div>
      );
    }
    return (
      <templates.image
        {..._graphic}
        classNamePrefixes={['dnd-multiple__dragitem']}
        attributionClassNamePrefixes={['component', 'dnd-multiple']}
      />
    );
  };

  return (
    <Draggable draggableId={title} index={index} isDragDisabled={!isEnabled}>
      {(provided) => (
        <div
          className={classes([
            'dnd-multiple__dragitem',
            _graphic.isBackground && 'has-graphic-background',
            isCorrect && 'is-correct',
            !isCorrect && isCorrect !== undefined && 'is-incorrect'
          ])}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {DragItemGraphic()}
          <span
            className='dnd-multiple__dragitem__title'
            dangerouslySetInnerHTML={{ __html: title }}
          ></span>
          <div className='dnd-multiple__dragitem__state'>
            <div
              className='dnd-multiple__dragitem__icon dnd-multiple__dragitem__correct-icon'
              aria-label={_globals._accessibility._ariaLabels.correct}
            >
              <div className='icon' aria-hidden='true'></div>
            </div>
            <div
              className='dnd-multiple__dragitem__icon dnd-multiple__dragitem__incorrect-icon'
              aria-label={_globals._accessibility._ariaLabels.incorrect}
            >
              <div className='icon' aria-hidden='true'></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
