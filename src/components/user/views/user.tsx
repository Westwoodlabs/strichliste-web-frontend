import { breakPoints, styled } from 'bricks-of-sand';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';

import { useFilteredUsers } from '../../../store';
import { startLoadingUsers } from '../../../store/reducers';
import { NavTabMenus } from '../../common/nav-tab-menu';
import { CreateUserInlineFormView } from '../create-user-inline-form';
import { useDispatch } from 'redux-react-hook';
import { ScrollToTop } from '../../common/scroll-to-top';
import { UserList } from '../user-list';
import { getUserDetailLink } from '../user-router';
import { get } from '../../../services/api';
import { errorHandler } from '../../../services/error-handler';

import { Scanner } from '../../common/scanner';

interface OwnProps {
  isActive: boolean;
  showCreateUserForm?: boolean;
}

type UserProps = OwnProps & RouteComponentProps;

const GridWrapper = styled('div')({
  marginLeft: '0rem',
  [breakPoints.tablet]: {
    marginLeft: '8rem',
  },
});

const CreateUserPosition = styled('div')({
  [breakPoints.tablet]: {
    zIndex: 10,
    position: 'absolute',
    marginLeft: '-2rem',
    marginTop: '6rem',
    bottom: 'initial',
    left: 'initial',
  },
  position: 'fixed',
  bottom: '1rem',
  left: '1rem',
  zIndex: 10,
});

export const User = (props: UserProps) => {
  const userIds = useFilteredUsers(props.isActive);
  const dispatch = useDispatch();

  useEffect(() => {
    startLoadingUsers(dispatch);
  }, [props.isActive, dispatch]);

  const handleUserScan = async (barcode: string) => {
    console.log('scanned user code: ', barcode);

    const promise = get(`user/token?token=${barcode}`);
    const data = await errorHandler<any>(dispatch, {
      promise,
    });
    if (data && data.user) {
      props.history.push(getUserDetailLink(data.user.id));
    }
  };

  return (
    <>
      <ScrollToTop />
      <GridWrapper>
        <CreateUserPosition>
          <CreateUserInlineFormView
            isActive={props.showCreateUserForm || false}
          />
        </CreateUserPosition>
        <NavTabMenus
          margin="2rem 1rem"
          breakpoint={320}
          label={<FormattedMessage id="USER_ACTIVE_LINK" />}
          tabs={[
            {
              to: '/user/active',
              message: <FormattedMessage id="USER_ACTIVE_LINK" />,
            },
            {
              to: '/user/inactive',
              message: <FormattedMessage id="USER_INACTIVE_LINK" />,
            },
          ]}
        />
        <UserList userIds={userIds} />
        <Scanner charset={/[a-z0-9_\-]/i} validator={/^U.{4,}/} onChange={handleUserScan} />
      </GridWrapper>
    </>
  );
};
