class Model {

  // This object should be communicating with a database, but right now
  // hardcoded values are ok.

  constructor() {
    this.todoItems = [
      {
        id: "todo01",
        label: "Cheese",
        createDate: new Date(1494101084857).toISOString(),
        finishedDate: null,
      }, {
        id: "todo02",
        label: "Bacon",
        createDate: new Date(1494101184857).toISOString(),
        finishedDate: null,
      },
    ];
  }

  getTodoItems() {
    return this.todoItems.filter((item) => (!item.deletedDate));
  }

  addTodoItem(newItem) {
    const item = {
      id: (1 * new Date()).toString(),
      label: newItem.label,
      createDate: new Date().toISOString(),
      finishedDate: null,
    }
    this.todoItems = [item, ...this.todoItems];
    return item;
  }

  updateTodoItem(itemId, changes) {
    this.todoItems = this.todoItems.map(
      (item) => (item.id == itemId ? { ...item, ...changes} : item));
  }

}

const getModel = () => {
  return new Model();
};

export default getModel;
