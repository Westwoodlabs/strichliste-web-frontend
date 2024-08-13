import * as React from 'react';
import { useSettings } from '../../store';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timerId: any = 0;

export function useIdleTimer(onTimeOut: () => void) {
  const settings = useSettings();

  const resetTimer = (timeout?: number, ...args: any[]) => {
    let defaultTimer = timeout === undefined ? settings.common.idleTimeout : timeout;
    clearTimeout(timerId);
    timerId = setTimeout(onTimeOutCheck, defaultTimer, ...args);
  };

  // Prevent onTimeOut if we are on a input field
  const onTimeOutCheck = (...args: any[]) => {
    // on first timout check, we check if we are on an input field,
    // if we are, we reset the timer to the remaining time of the idleTimeoutOnInput.
    // if that time passes as well, we will call onTimeOut.
    // we also call onTimeOut immediately if we are not on an input field.
    // the 'scanner' element doesn't count as an input field.
    let isIdleOnInput = args.length > 0 && args[0] === 'input-idle-check';
    if (!isIdleOnInput && document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.id !== "scanner") {
      console.log('Idle timeout prevented. Current active element:', document.activeElement);
      resetTimer(settings.common.idleTimeoutOnInput - settings.common.idleTimeout, 'input-idle-check');
    } else {
      console.log('Idle timeout passed. Current active element:', document.activeElement);
      onTimeOut();
    }
  };

  React.useEffect(() => {
    resetTimer();
    let doReset = () => resetTimer(); //use default timeout
    document.addEventListener('scroll', doReset);
    document.addEventListener('click', doReset);
    document.addEventListener('touch', doReset);
    document.addEventListener('keyup', doReset);
    return () => {
      document.removeEventListener('scroll', doReset);
      document.removeEventListener('click', doReset);
      document.removeEventListener('touch', doReset);
      document.removeEventListener('keyup', doReset);
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
