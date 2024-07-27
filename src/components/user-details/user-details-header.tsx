import {
  AlertText,
  Tab,
  styled,
  withTheme,
  PayPal,
  Icon,
} from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { useSettings } from '../../store';
import { User } from '../../store/reducers';
import { Currency } from '../currency';
import { ProductIcon } from '../ui/icons/product';
import { ShoppingBagIcon } from '../ui/icons/shopping-bag';
import { TransactionIcon } from '../ui/icons/transactions';
import { UserName } from '../user/user-name';
import { UserDetailRouter } from './user-details-router';
import { ScrollContainer } from '../common/scroll-container/scroll-container';
import { en } from '../../locales/en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LinkTab: any = styled(Tab(NavLink))({
  svg: {
    marginRight: '0.5rem',
  },
});

const UserHeader = withTheme(
  styled('div')(
    {
      margin: '0 auto',

      h1: {
        textTransform: 'none',
        fontSize: '2rem',
        textAlign: 'center',
        margin: '1rem auto',
      },
    },
    props => ({
      padding: '0 1rem',
      [props.theme.breakPoints.tablet]: {
        width: '29rem',
      },
      h1: {
        color: props.theme.primary,
      },
    })
  )
);

const toggleTab = (
  url: string,
  currentUrl: string,
  userUrl: string
): string => {
  return url === currentUrl ? userUrl : url;
};

export interface UserDetailsHeaderProps extends RouteComponentProps {
  user: User;
  barmode: boolean;
}

const Component = ({ user, location, barmode }: UserDetailsHeaderProps) => {
  const currentUrl = location.pathname;
  const userUrl = `/user/${user.id}`;
  const settings = useSettings();
  const intl = useIntl();

  return (
    <UserHeader>
      <h1>
        <UserName center name={user.name} />
      </h1>
      <h1 title={intl.formatMessage({ id: en.BALANCE_TITLE })}>
        <AlertText value={user.balance}>
          <Currency value={user.balance} />
        </AlertText>
      </h1>

      {!barmode && (
        <>
          <ScrollContainer style={{ justifyContent: 'space-between' }}>
            <LinkTab
              activeClassName="active"
              to={toggleTab(
                `/user/${user.id}/send_money_to_a_friend`,
                currentUrl,
                userUrl
              )}
            >
              <TransactionIcon />{' '}
              <FormattedMessage id="USER_TRANSACTION_CREATE_LINK" />
            </LinkTab>
            {settings.article.enabled && (
              <LinkTab
                activeClassName="active"
                to={toggleTab(`/user/${user.id}/article`, currentUrl, userUrl)}
              >
                <ShoppingBagIcon /> <FormattedMessage id="USER_ARTICLE_LINK" />
              </LinkTab>
            )}
            <LinkTab
              activeClassName="active"
              to={toggleTab(`/user/${user.id}/edit`, currentUrl, userUrl)}
            >
              <ProductIcon /> <FormattedMessage id="USER_EDIT_LINK" />
            </LinkTab>
            {settings.paypal.enabled && (
              <LinkTab
                activeClassName="active"
                to={toggleTab(`/user/${user.id}/paypal`, currentUrl, userUrl)}
              >
                <Icon width="1rem" height="1rem">
                  <PayPal />
                </Icon>{' '}
                <FormattedMessage id="PAYPAL_LINK" defaultMessage="Paypal" />
              </LinkTab>
            )}
          </ScrollContainer>
        </>
      )}
      <UserDetailRouter />
    </UserHeader>
  );
};

export const UserDetailsHeader = withRouter(Component);
