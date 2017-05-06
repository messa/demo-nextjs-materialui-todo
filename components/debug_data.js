import React, {Component} from 'react';

export default (props) => (
  <div style={{
    padding: '.1rem .75em',
    borderLeft: '1px solid #930',
    marginTop: '1rem',
    marginBottom: '1rem',
  }}>
    <div style={{
      color: '#930',
      fontSize: '125%',
      fontWeight: '300',
    }}>
      {props.title}
    </div>
    <pre style={{
      fontSize: '85%',
      lineHeight: '1.2',
      fontFamily: 'inconsolata, terminus, monospace',
      marginBottom: '0',
      overflowX: 'auto',
    }}>
      {JSON.stringify(props.data, null, 2)}
    </pre>
  </div>
);
