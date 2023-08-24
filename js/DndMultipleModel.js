import QuestionModel from "core/js/models/questionModel";
import Adapt from "core/js/adapt";

export default class DnDMultipleModel extends QuestionModel {
  init() {
    super.init();
    this.checkCanSubmit();
    const textId = this.get("textId") || [];

    if (!textId.length) {
      this.setUpItems();
    } else {
      const userInput = Adapt.findById(textId[textId.length - 1]);
      if (userInput) {
        userInput.on("change:_isComplete", this.onUserInputComplete, this);
      } else {
        console.error(
          `Component with id ${textId[textId.length - 1]} not found.`
        );
      }
    }
  }

  onUserInputComplete(_, isComplete) {
    if (isComplete) this.updateItems();
  }

  stringsToItems(strings) {
    return strings.map((text, index) => ({
      title: text,
      _graphic: { src: "", isBackground: false, alt: "" },
      id: index,
      _optionIndex: index,
      _itemIndex: Math.floor(index / 3) + 1,
      _itemId: Math.floor(index / 3),
      _isCorrect: true,
    }));
  }

  updateItems() {
    const updatedValues = this.get("textId")
      .map((a) =>
        Adapt.findById(a)
          .get("_items")
          .map((item) => item.userAnswer)
      )
      .flat();

    if (!updatedValues) return;

    const newOptions = this.stringsToItems(updatedValues);
    const existingItems = this.get("_items") || [];

    if (existingItems.length > 0) {
      existingItems[0]._options = newOptions;
      this.set({ _items: existingItems });
      this.setUpItems();
    }
  }

  setUpItems() {
    const items = [...(this.get("_items") || [])];

    items.forEach((item, itemIndex) => {
      item.id = itemIndex + 1;
      item.droppableId = item.id.toString();
      item._isCorrect = true;
      item._userAnswer = [];
      const itemOptions = item._options || [];
      itemOptions.forEach((option, optionIndex) => {
        option.id = optionIndex;
        option._optionIndex = optionIndex;
        option._itemIndex = item.id;
        option._itemId = itemIndex;
        option._isCorrect = true;
      });
    });

    items.unshift({
      title: this.get("_startText") || "",
      _options: [],
      id: 0,
      droppableId: "0",
    });
    this.set({ _correctItems: items, _items: items });
    this.setUpItemsOptions();
  }

  setUpItemsOptions() {
    const items = [...(this.get("_items") || [])];

    const options = items.reduce((acc, item) => {
      acc.push(...(item._options || []));
      return acc;
    }, []);

    items.forEach((item) => {
      if (item.id !== 0) item._options = [];
    });

    options.sort(() => Math.random() - 0.5);
    items[0]._options.push(...options);

    const initialItems = items.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    this.set({ _items: initialItems, _allOptions: options });
  }

  reset(type = "hard", canReset = this.get("_canReset")) {
    const wasReset = super.reset(type, canReset);
    if (!wasReset) return false;

    this.set({
      _isAtLeastOneCorrectSelection: false,
      _isCorrect: null,
    });

    return true;
  }

  restoreUserAnswers() {
    if (!this.get("_isSubmitted")) return;

    const userAnswer = this.get("_userAnswer");
    const items = JSON.parse(JSON.stringify(this.get("_items")));

    userAnswer.forEach((answer) => {
      const itemId = answer[0];
      const optionId = answer[1] - 1;
      const option = items[0]._options.find((option) => {
        return option.id === optionId;
      });
      items[itemId]._options.push(option);
    });
    items[0]._options = [];
    this.set({ _items: items });
    this.checkCanSubmit();
    this.setQuestionAsSubmitted();
    this.markQuestion();
    this.markItems();
    this.setScore();
    this.setupFeedback();
  }

  canSubmit() {
    return this.get("_items")[0]._options.length === 0;
  }

  setItems(items) {
    this.set({ _items: items });
    this.checkCanSubmit();
  }

  markItems() {
    const objItems = this.get("_items");
    const items = Object.keys(objItems).map((key) => objItems[key]);
    items.forEach((item) => {
      item._options.forEach((option, optionIndex) => {
        if (this.get("_useStrictOrder")) {
          option._isCorrect =
            option._optionIndex === optionIndex &&
            option._itemIndex === item.id;
        } else {
          option._isCorrect = option._itemIndex === item.id;
        }
      });
      if (
        item._options.every((option) => {
          return option._isCorrect;
        })
      ) {
        item._isCorrect = true;
      } else {
        item._isCorrect = false;
      }
    });
    this.setItems(items);
  }

  storeUserAnswer() {
    const items = this.getDraggableItems();
    this.isCorrect();
    this.markItems();
    const userAnswer = items.reduce((userAnswer, item) => {
      userAnswer.push(
        ...item._options.map((option) => {
          return [Number(item.droppableId), option.id + 1];
        })
      );
      return userAnswer;
    }, []);
    this.set({
      _userAnswer: userAnswer,
    });
  }

  getDraggableItems() {
    const items = this.get("_items");
    return Object.keys(items)
      .filter((key) => key !== "0")
      .map((key) => items[key]);
  }

  isCorrect() {
    const hasAllCorrectAnswers = this.getDraggableItems().every((item) => {
      return item._options.every((option, optionIndex) => {
        if (this.get("_useStrictOrder")) {
          return (
            option._itemIndex === item.id && option._optionIndex === optionIndex
          );
        }
        return option._itemIndex === item.id;
      });
    });
    const hasIncorrectAnswers = this.getDraggableItems().some((item) => {
      return item._options.some((option) => {
        return option._itemIndex !== item.id;
      });
    });
    const hasPartlyCorrectAnswers = this.getDraggableItems().some((item) => {
      return item._options.some((option) => {
        return option._itemIndex === item.id;
      });
    });

    const _numberOfCorrectAnswers = this.getDraggableItems().reduce(
      (numberOfCorrectAnswers, item) => {
        return (
          numberOfCorrectAnswers +
          item._options.filter((option, optionIndex) => {
            if (!option) return false;
            if (this.get("_useStrictOrder")) {
              return (
                option._itemIndex === item.id &&
                option._optionIndex === optionIndex
              );
            }
            return option._itemIndex === item.id;
          }).length
        );
      },
      0
    );
    this.set({
      _isAtLeastOneCorrectSelection: hasPartlyCorrectAnswers,
      _numberOfCorrectAnswers,
    });
    return hasAllCorrectAnswers && !hasIncorrectAnswers;
  }

  isPartlyCorrect() {
    return this.get("_isAtLeastOneCorrectSelection");
  }

  setScore() {
    const numberOfCorrectAnswers = this.get("_numberOfCorrectAnswers");
    const questionWeight = this.get("_questionWeight");
    const optionsLength = this.getDraggableItems().reduce(
      (optionsLength, item) => {
        return optionsLength + item._options.length;
      },
      0
    );

    const score = (questionWeight * numberOfCorrectAnswers) / optionsLength;
    this.set("_score", score);
  }

  resetUserAnswer() {
    this.set("_userAnswer", []);
  }

  resetItems() {
    const objectItems = this.get("_items");
    const items = Object.keys(this.get("_items")).map(
      (key) => objectItems[key]
    );
    items.forEach((item) => {
      item._isCorrect = true;
      item._userAnswer = [];
      item._options = [];
    });
    items[0]._options = this.get("_allOptions");
    const intialItems = items.reduce((intialItems, item) => {
      intialItems[item.id] = item;
      return intialItems;
    }, {});
    this.setItems(intialItems);
  }

  resetQuestion() {
    this.resetItems();
  }

  getResponse() {
    const response = this.get("_userAnswer").map((option) => {
      return option.join(".");
    });
    return response.join("#");
  }

  getResponseType() {
    return "matching";
  }

  getInteractionObject() {
    return {};
  }

  getCorrectAnswerAsText() {
    return "";
  }

  getUserAnswerAsText() {
    return "";
  }
}
