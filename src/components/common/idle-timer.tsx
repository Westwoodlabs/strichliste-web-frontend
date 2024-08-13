import * as React from 'react';
import { useSettings } from '../../store';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timerId: any = 0;

export function useIdleTimer(onTimeOut: () => void) {
  const settings = useSettings();

  const resetTimer = (...args) => {
    let defaultTimer = settings.common.idleTimeout;
    if (args.length > 2) {
      defaultTimer = args[2];
    }

    clearTimeout(timerId);
    timerId = setTimeout(onTimeOutCheck, defaultTimer);
  };

  // Prevent onTimeOut if we are on a input field
  const onTimeOutCheck = () => {

    if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.id !== "scanner") {
      console.log('Idle timeout prevented. Current active element:', document.activeElement);
      resetTimer(settings.common.idleTimeoutOnInput - settings.common.idleTimeout);
    } else {
      console.log('Idle timeout passed. Current active element:', document.activeElement);
      onTimeOut();
    }
  };

  React.useEffect(() => {
    resetTimer();
    document.addEventListener('scroll', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('touch', resetTimer);
    document.addEventListener('keyup', resetTimer);
    return () => {
      document.removeEventListener('scroll', resetTimer);
      document.removeEventListener('click', resetTimer);
      document.removeEventListener('touch', resetTimer);
      document.removeEventListener('keyup', resetTimer);
      clearTimeout(timerId);
    };
  }, []);
}

export const WrappedIdleTimer = React.memo(
  withRouter((props: RouteComponentProps) => {
    useIdleTimer(() => props.history.push('/'));
    return null;
  })
);
