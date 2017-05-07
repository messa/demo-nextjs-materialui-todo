class Model {

  // This object should be communicating with a database, but right now
  // hardcoded values are ok.

  getTodoItems() {
    return [
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

}

const getModel = () => {
  return new Model();
};

export default getModel;
