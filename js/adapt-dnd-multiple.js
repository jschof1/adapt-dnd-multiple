import components from 'core/js/components';
import DndMultipleView from './DndMultipleView';
import DndMultipleModel from './DndMultipleModel';

export default components.register('dnd-multiple', {
  model: DndMultipleModel,
  view: DndMultipleView
});
