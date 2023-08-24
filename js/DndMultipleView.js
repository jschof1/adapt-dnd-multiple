import QuestionView from 'core/js/views/questionView';

class DndMultipleView extends QuestionView {
  preinitialize() {
    this.setItems = (...args) => this.model.setItems(...args);
  }

  initialize() {
    super.initialize();
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
