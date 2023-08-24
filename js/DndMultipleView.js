import QuestionView from 'core/js/views/questionView';

class DndMultipleView extends QuestionView {
  preinitialize() {
    this.setItems = (...args) => this.model.setItems(...args);
  }

  initialize() {
    super.initialize();
    // Listen for changes in the _items attribute
    this.listenTo(this.model, 'change:_items', this.render);
  }

  setupQuestion() {
  }

  onQuestionRendered() {
    this.setReadyStatus();
  }
}

DndMultipleView.template = 'dndMultiple.jsx';

export default DndMultipleView;
