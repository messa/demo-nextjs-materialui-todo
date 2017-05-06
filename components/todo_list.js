import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RestoreIcon from 'material-ui/svg-icons/action/restore';

const iconColumnStyle = {
  width: "4em",
  // backgroundColor: '#eee',
  paddingLeft: 0,
  paddingRight: 0,
  textAlign: 'center',
  textOverflow: 'fade',
};

const upperCaseFirst = (s) => (s ? (s[0].toUpperCase() + s.substr(1)) : s);

const sorted = (items, keyFactory) => {
  const temp = items.map((item) => ({key: keyFactory(item), value: item}));
  temp.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return temp.map(({value}) => value);
};

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
      { item.createDate.toString() }
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
      {
        item.finishedDate
          ? item.finishedDate.toString()
          : (
            <FlatButton
              label="Finish"
              secondary={true}
              onTouchTap={(event) => handleFinishItem(item)}
            />
          )
      }
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

  state = {
    newItemLabel: '',
    allItems: [
      {
        label: "first",
        createDate: new Date(1494101084857),
      }
    ],
    largeWidth: true,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const label = this.state.newItemLabel;
    if (label) {
      const newItem = {
        label,
        createDate: new Date(),
      };
      this.setState((state) => ({
        newItemLabel: '',
        allItems: [newItem, ...state.allItems],
      }));
    }
  };

  markItemFinished = (finishedItem) => {
    this.setState((state) => {
      const newItems = [];
      for (let item of state.allItems) {
        if (item === finishedItem) {
          item = {
            ...item,
            finishedDate: new Date(),
          }
        }
        newItems.push(item);
      }
      return {
        allItems: newItems,
      };
    });
  };

  markItemUnfinished = (unfinishedItem) => {
    this.setState((state) => {
      const newItems = [];
      for (let item of state.allItems) {
        if (item === unfinishedItem) {
          item = {
            ...item,
            finishedDate: null,
          }
        }
        newItems.push(item);
      }
      return {
        allItems: newItems,
      };
    });
  };


  markItemDeleted = (deletedItem) => {
    this.setState((state) => {
      const newItems = [];
      for (let item of state.allItems) {
        if (item === deletedItem) {
          item = {
            ...item,
            deletedDate: new Date(),
          }
        }
        newItems.push(item);
      }
      return {
        allItems: newItems,
      };
    });
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
        <div style={{marginTop: '1rem'}}>
          <h2>Add new item</h2>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="label"
              hintText="New todo item"
              value={this.state.newItemLabel}
              onChange={(event) => {
                this.setState({
                  newItemLabel: upperCaseFirst(event.target.value),
                });
              }}
            />
          </form>
          <br />
        </div>

        <div style={{
          padding: '.1rem .75em',
          borderLeft: '1px solid #930',
        }}>
          <div style={{
            color: '#930',
            fontSize: '125%',
            fontWeight: '300',
          }}>
            State
          </div>
          <pre style={{
            fontSize: '85%',
            lineHeight: '1.2',
            fontFamily: 'inconsolata, terminus, monospace',
            marginBottom: '0',
            overflowX: 'auto',
          }}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
        </div>

      </div>
    );
  }

}
