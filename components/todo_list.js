import React, {Component} from 'react';
import TimeAgo from 'react-timeago'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RestoreIcon from 'material-ui/svg-icons/action/restore';
import CircularProgress from 'material-ui/CircularProgress';

import DebugData from './debug_data';
import AddNewItem from './add_new_item';

const iconColumnStyle = {
  width: "4em",
  // backgroundColor: '#eee',
  paddingLeft: 0,
  paddingRight: 0,
  textAlign: 'center',
  textOverflow: 'fade',
};

/*
const sorted = (items, keyFactory) => {
  const temp = items.map((item) => ({key: keyFactory(item), value: item}));
  temp.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return temp.map(({value}) => value);
};
*/

const LabelCell = (props) => {
  const { item, colSpan } = props;
  return (
    <TableRowColumn colSpan={colSpan || "1"}>
      <strong style={{ fontWeight: '500' }}>
        { item.label }
      </strong>
    </TableRowColumn>
  );
};

const CreatedDateCell = (props) => {
  const { item } = props;
  return (
    <TableRowColumn
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      }}
    >
      <TimeAgo date={new Date(item.createDate)} />
    </TableRowColumn>
  );
};

const FinishedDateCell = (props) => {
  const { item, handleFinishItem } = props;
  let content = null;
  if (item.finishedWIP) {
    content = (
      <CircularProgress size={18} />
    );
  } else if (item.finishedDate) {
    content = (
      <TimeAgo date={new Date(item.finishedDate)} />
    );
  } else {
    content = (
      <FlatButton
        label="Finish"
        secondary={true}
        onTouchTap={(event) => handleFinishItem(item)}
      />
    );
  }
  let err = null;
  if (item.finishedWIPError) {
    err = (
      <div style={{ color: 'red' }}>
        Failed: {item.finishedWIPError}
      </div>
    );
  }
  return (
    <TableRowColumn
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      }}
    >
      {content}
      {err}
    </TableRowColumn>
  );
};

const ActionCell = (props) => {
  const { item, handleUnfinishItem, handleDeleteItem } = props;
  return (
    <TableRowColumn style={iconColumnStyle}>
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      >
        <MenuItem
          primaryText="Undo finish"
          leftIcon={<RestoreIcon />}
          disabled={!item.finishedDate}
          onTouchTap={(event) => handleUnfinishItem(item)}
        />
        <MenuItem
          primaryText="Delete"
          leftIcon={<DeleteIcon />}
          onTouchTap={(event) => handleDeleteItem(item)}
        />
      </IconMenu>
    </TableRowColumn>
  );
};

export default class TodoList extends React.Component {

  constructor(props) {
    super(props);
    console.info(`TodoList initial props.initialTodoItems: ${JSON.stringify(props.initialTodoItems)}`);
    this.state = {
      allItems: [...props.initialTodoItems],
      largeWidth: true,
    };
  }

  handleNewItem = ({label}, afterCallback) => {
    if (!label) {
      return;
    }
    const newItem = {
      label,
    };
    this.setState({
      addWIP: true,
      addWIPError: null,
    });
    fetch('/api/todo-items/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newTodoItem: newItem,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { newTodoItem } = data;
      this.setState((state) => ({
        allItems: [newTodoItem, ...state.allItems],
        addWIP: false,
        addWIPError: null,
      }));
      afterCallback(true);
    })
    .catch((err) => {
      const msg = err.toString();
      this.setState({
        addWIP: false,
        addWIPError: msg,
      });
      afterCallback(false);
    })

  };

  setItemState = (itemId, changes) => {
    this.setState((state) => ({
      allItems: state.allItems.map((item) => (
        item.id == itemId
          ? { ...item, ...changes }
          : item
      )),
    }));
  };

  markItemFinished = (finishedItem) => {
    const finishedItemId = finishedItem.id;
    this.setItemState(finishedItemId, {
      finishedWIP: true,
      finishedWIPError: null,
    });
    fetch('/api/todo-items/mark-finished', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        todoItemId: finishedItemId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setItemState(finishedItemId, {
        finishedDate: data.finishedDate,
        finishedWIP: false,
        finishedWIPError: null,
      });
    })
    .catch((err) => {
      const msg = err.toString();
      this.setItemState(finishedItemId, {
        finishedWIP: false,
        finishedWIPError: msg,
      });
    })
  };

  markItemUnfinished = (unfinishedItem) => {
    const unfinishedItemId = unfinishedItem.id;
    this.setItemState(unfinishedItemId, {
      finishedWIP: true,
      finishedWIPError: null,
    });
    fetch('/api/todo-items/mark-unfinished', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        todoItemId: unfinishedItemId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setItemState(unfinishedItemId, {
        finishedDate: null,
        finishedWIP: false,
        finishedWIPError: null,
      });
    })
    .catch((err) => {
      const msg = err.toString();
      this.setItemState(unfinishedItemId, {
        finishedWIP: false,
        finishedWIPError: msg,
      });
    })
  };

  markItemDeleted = (deletedItem) => {
    const deletedItemId = deletedItem.id;
    this.setItemState(deletedItemId, {
      finishedWIP: true,
      finishedWIPError: null,
    });
    fetch('/api/todo-items/mark-deleted', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        todoItemId: deletedItemId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setItemState(deletedItemId, {
        deletedDate: data.deletedDate,
        finishedWIP: false,
        finishedWIPError: null,
      });
    })
    .catch((err) => {
      const msg = err.toString();
      this.setItemState(deletedItemId, {
        finishedWIP: false,
        finishedWIPError: msg,
      });
    })
  };

  handleWindowResize = () => {
    this.setState({
      largeWidth: window.innerWidth > 500,
    });
  };

  componentDidMount() {
    this.setState({
      largeWidth: window.innerWidth > 500,
    });
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  render() {
    const large = this.state.largeWidth;
    let showItems = this.state.allItems.filter((item) => !item.deletedDate);
    /*
    showItems = sorted(showItems, (item) => -1 * item.createDate);
    showItems = sorted(showItems, (item) => (item.finishedDate ? -1 * item.finishedDate : -Infinity));
    */
    return (
      <div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            {large ? (
              <TableRow>
                <TableHeaderColumn>Todo</TableHeaderColumn>
                <TableHeaderColumn>Created</TableHeaderColumn>
                <TableHeaderColumn>Finished</TableHeaderColumn>
                <TableHeaderColumn style={iconColumnStyle}></TableHeaderColumn>
              </TableRow>
            ) : (
              <TableRow>
                <TableHeaderColumn>Created</TableHeaderColumn>
                <TableHeaderColumn>Finished</TableHeaderColumn>
                <TableHeaderColumn style={iconColumnStyle}></TableHeaderColumn>
              </TableRow>
            )}
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={false}
            stripedRows={false}
          >
            {showItems.map((item, n) => (
              large ? (
                <TableRow key={n}>
                  <LabelCell item={item} />
                  <CreatedDateCell item={item} />
                  <FinishedDateCell item={item} handleFinishItem={this.markItemFinished} />
                  <ActionCell
                    item={item}
                    handleUnfinishItem={this.markItemUnfinished}
                    handleDeleteItem={this.markItemDeleted}
                  />
                </TableRow>
              ) : [
                <TableRow key={"A"+n} style={{borderBottom: "none"}}>
                  <LabelCell colSpan="3" item={item} />
                </TableRow>,
                <TableRow key={"B"+n}>
                  <CreatedDateCell item={item} />
                  <FinishedDateCell item={item} handleFinishItem={this.markItemFinished} />
                  <ActionCell
                    item={item}
                    handleUnfinishItem={this.markItemUnfinished}
                    handleDeleteItem={this.markItemDeleted}
                  />
                </TableRow>
              ]
            ))}
          </TableBody>
        </Table>

        <AddNewItem handleNewItem={this.handleNewItem} disabled={this.state.addWIP} />

        {this.state.addWIP ? (
          <CircularProgress size={18} />
        ) : null}

        {this.state.addWIPError ? (
          <div style={{ color: 'red' }}>
            {this.state.addWIPError}
          </div>
        ) : null}

        <DebugData title="TodoList state" data={this.state} />
        <DebugData title="TodoList props" data={this.props} />
      </div>
    );
  }

}
