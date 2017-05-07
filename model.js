class Model {

  // This object should be communicating with a database, but right now
  // hardcoded values are ok.

  getTodoItems() {
    return [
      {
        label: "Cheese",
        createDate: new Date(1494101084857).toISOString(),
        finishedDate: null,
      }, {
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
