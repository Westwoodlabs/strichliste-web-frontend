import * as React from 'react';
import { Scanner } from '../common/scanner';
import { Toast } from '../common/toast';
import { useDispatch } from 'redux-react-hook';
import { get } from '../../services/api';
import { errorHandler } from '../../services/error-handler';
import { getUserDetailLink } from './user-router';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = RouteComponentProps;

export const UserScanner = withRouter((props: Props) => {
  const [message, setMessage] = React.useState('');
  const dispatch = useDispatch();

  const handleUserScan = async (barcode: string) => {
    console.log('Scanned token (user code):', barcode);
    setMessage(`Scanned '${barcode}'. Please wait...`)

    const promise = get(`user/token?token=${barcode}`);
    const data = await errorHandler<any>(dispatch, {
      promise,
    });
    if (data && data.error && data.error.message) {
      setMessage(data.error.message);
    } else if (data && data.user) {
      props.history.push(getUserDetailLink(data.user.id));
    }

  };
  const resetState = () => {
    setMessage('');
  };

  return (
    <>
      {message && (
        <Toast onFadeOut={resetState} fadeOutSeconds={6}>
          <ToastContent message={message} />
        </Toast>
      )}
      <Scanner charset={/[a-zA-Z0-9_\-]/i} validator={/.{4,}/i} onChange={handleUserScan} />
    </>
  );
});

interface ToastProps {
  message: string;
}

function ToastContent({ message }: ToastProps): JSX.Element {
  return <>{message}</>;
}
