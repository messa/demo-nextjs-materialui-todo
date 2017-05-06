import injectTapEventPlugin from 'react-tap-event-plugin';

const onClient = (typeof window !== 'undefined')

if (onClient) {
  // Needed for onTouchTap
  // http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();
}
