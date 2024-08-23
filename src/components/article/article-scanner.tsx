import { AcceptIcon, Flex } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Article,
  getArticleByBarcode,
  startCreatingTransaction,
} from '../../store/reducers';
import { Scanner } from '../common/scanner';
import { Toast } from '../common/toast';
import { Currency } from '../currency';
import { AcceptWrapper } from '../transaction/create-user-transaction-form';
import { useDispatch } from 'redux-react-hook';
import { get } from '../../services/api';
import { errorHandler } from '../../services/error-handler';
import { getUserDetailLink } from '../user/user-router';
import { RouteComponentProps, withRouter } from 'react-router';


// Combine Props and RouterProps
interface Props extends RouteComponentProps<{}> {
  userId: string;
}


export const ArticleScanner = withRouter((props: Props) => {
  const [message, setMessage] = React.useState('');
  const [article, setArticle] = React.useState<Article | undefined>(undefined);
  const dispatch = useDispatch();

  const handleChange = async (barcode: string) => {
    console.log('Scanned article:', barcode);
    setMessage(`Scanned '${barcode}'. Please wait...`)
    try {
      const article = await getArticleByBarcode(dispatch, barcode);
      setMessage('ARTICLE_FETCHED_BY_BARCODE');
      setArticle(article);
      if (article) {
        startCreatingTransaction(dispatch, props.userId, {
          articleId: article.id,
        });
      }
    } catch (error) {
      setMessage(':(');
    }
  };

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
    setArticle(undefined);
  };

  return (
    <>
      {message && (
        <Toast onFadeOut={resetState} fadeOutSeconds={6}>
          <ToastContent article={article} message={message} />
        </Toast>
      )}
      <Scanner charset={/[0-9]/i} validator={/.{8,}/} onChange={handleChange} />
      <Scanner charset={/[a-zA-Z0-9_\-]/i} validator={/W24.{3}/i} onChange={handleUserScan} />

    </>
  );
});

interface ToastProps {
  message: string;
  article: Article | undefined;
}

function ToastContent({ article, message }: ToastProps): JSX.Element {
  if (article === undefined) {
    return <>{message}</>;
  }
  return (
    <AcceptWrapper>
      <Flex justifyContent="center" alignContent="center">
        <AcceptIcon />
        <FormattedMessage id="ARTICLE_FETCHED_BY_BARCODE" />
        &#8594; {article.name}
        <Currency value={article.amount} />
      </Flex>
    </AcceptWrapper>
  );
}
