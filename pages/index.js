import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500, grey100, grey400, grey500} from 'material-ui/styles/colors';
import {orange500, orange700, deepOrange800, blueGrey500, blue500, red600} from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';

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

class IndexPage extends React.Component {

  static async getInitialProps ({ req }) {
    return {
      userAgent: req ? req.headers['user-agent'] : navigator.userAgent,
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
            />

            <div style={containerStyles}>

              <TodoList/>

            </div>

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default IndexPage;
