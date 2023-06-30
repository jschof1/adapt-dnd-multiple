import QuestionView from 'core/js/views/questionView';

class DndMultipleView extends QuestionView {
  preinitialize() {
    this.setItems = (...args) => this.model.setItems(...args);
  }

  setupQuestion() {}

  onQuestionRendered() {
    this.setReadyStatus();
  }
}

DndMultipleView.template = 'dndMultiple.jsx';

export default DndMultipleView;
