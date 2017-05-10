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
  return (
    <TableRowColumn
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      }}
    >
      {item.finishedDate ? (
        <TimeAgo date={new Date(item.finishedDate)} />
      ) : (
        <FlatButton
          label="Finish"
          secondary={true}
          onTouchTap={(event) => handleFinishItem(item)}
        />
      )}
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

  handleNewItem = ({label}) => {
    if (label) {
      const newItem = {
        label,
        id: '' + new Date() * 1,
        createDate: new Date().toISOString(),
      };
      this.setState((state) => ({
        allItems: [newItem, ...state.allItems],
      }));
    }
  };

  markItemFinished = (finishedItem) => {
    const finishedItemId = finishedItem.id;
    this.setState((state) => ({
      allItems: state.allItems.map((item) => (
        item.id == finishedItemId
          ? { ...item, finishedDate: new Date().toISOString() }
          : item
      )),
    }));
  };

  markItemUnfinished = (unfinishedItem) => {
    const unfinishedItemId = unfinishedItem.id;
    this.setState((state) => ({
      allItems: state.allItems.map((item) => (
        item.id == unfinishedItemId
          ? { ...item, finishedDate: null }
          : item
      )),
    }));
  };

  markItemDeleted = (deletedItem) => {
    const deletedItemId = deletedItem.id;
    this.setState((state) => ({
      allItems: state.allItems.map((item) => (
        item.id == deletedItemId
          ? { ...item, deletedDate: new Date().toISOString() }
          : item
      )),
    }));
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
        <AddNewItem handleNewItem={this.handleNewItem} />
        <DebugData title="TodoList state" data={this.state} />
        <DebugData title="TodoList props" data={this.props} />
      </div>
    );
  }

}
