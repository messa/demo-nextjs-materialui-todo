import React, {Component} from 'react';
import TextField from 'material-ui/TextField';

import DebugData from './debug_data';

const upperCaseFirst = (s) => (s ? (s[0].toUpperCase() + s.substr(1)) : s);

export default class AddNewItem extends React.Component {

  state = {
    newItemLabel: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const label = this.state.newItemLabel;
    this.props.handleNewItem({label});
    this.setState({
      newItemLabel: '',
    });
  };

  render() {
    return (
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
        <DebugData title="AddNewItem state" data={this.state} />
      </div>
    );
  }

}
