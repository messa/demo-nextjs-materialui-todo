import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'next/router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {deepOrange500, grey100, grey400, grey500} from 'material-ui/styles/colors';
import {orange500, orange700, deepOrange800, blueGrey500, blue500, red600} from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import '../components/tap_events';
import CustomHead from '../components/custom_head';
import TodoList from '../components/todo_list';

const themePalette = {
  primary1Color: blue500,
  //primary2Color: orange700,
  //primary3Color: grey400,
  accent1Color: red600,
  //accent2Color: grey100,
  //accent3Color: grey500,
};

const containerStyles = {
  paddingTop: '1rem',
  paddingBottom: '1rem',
  paddingLeft: '1em',
  paddingRight: '1em',
};

const retrieveTodoItems = async () => {
  const res = await fetch('/api/todo-items/all');
  const data = await res.json();
  const { todoItems } = data;
  console.info(`Retrieved ${todoItems.length} todoItems: ${JSON.stringify(todoItems)}`);
  return todoItems;
}

class IndexPage extends React.Component {

  static async getInitialProps ({ req }) {
    console.info('In IndexPage getInitialProps');
    return {
      userAgent: req ? req.headers['user-agent'] : navigator.userAgent,
      initialTodoItems: req ? req.model.getTodoItems() : await retrieveTodoItems(),
    }
  }

  render() {
    return (
      <div>
        <CustomHead/>
        <MuiThemeProvider
          muiTheme={getMuiTheme({
            palette: themePalette,
            userAgent: this.props.userAgent,
          })}
        >
          <div>
            <AppBar
              title="Todo App Demo"
              showMenuIconButton={false}
              iconElementRight={
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                 >
                   <MenuItem
                     primaryText="About"
                     onTouchTap={(event) => {
                       console.info('About MenuItem onTouchTap');
                       Router.push('/about');
                     }}
                   />
                 </IconMenu>
              }
            />

            <div style={containerStyles}>

              <TodoList initialTodoItems={this.props.initialTodoItems} />

            </div>

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default IndexPage;
