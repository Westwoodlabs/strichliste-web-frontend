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

interface Props {
  userId: string;
}

export const ArticleScanner = (props: Props) => {
  const [message, setMessage] = React.useState('');
  const [article, setArticle] = React.useState<Article | undefined>(undefined);
  const dispatch = useDispatch();

  const handleChange = async (barcode: string) => {
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
      <Scanner charset={/[a-zA-Z0-9]/i} validator={/.{6,}/} onChange={handleChange} />
    </>
  );
};

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
