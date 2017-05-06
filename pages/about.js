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
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';


import '../components/tap_events';
import CustomHead from '../components/custom_head';

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

class AboutPage extends React.Component {

  static async getInitialProps ({ req }) {
    console.info('In AboutPage getInitialProps');
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
              title="About Todo App Demo"
              iconElementLeft={
                <IconButton
                  onTouchTap={(event) => {
                    Router.push('/');
                  }}
                >
                  <NavigationBack />
                </IconButton>
              }
              iconElementRight={
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                 >
                   <MenuItem
                     primaryText="Dashboard"
                     onTouchTap={(event) => {
                       Router.push('/');
                     }}
                   />
                 </IconMenu>
              }
            />

            <div style={containerStyles}>

              <p>Hello!</p>

            </div>

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AboutPage;
