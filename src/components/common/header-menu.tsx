import { HeaderNavBar } from 'bricks-of-sand';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Logo } from '../ui/icons/logo';
import { ScrollContainer } from './scroll-container/scroll-container';
import { useSettings } from '../../store';
import { useBarmode } from '../settings/barmode';
import { SearchIcon } from '../ui/icons/search';

const navLinkStyle = { marginRight: '1rem' };


export function HeaderMenu(): JSX.Element {
  const settings = useSettings();
  const barmode = useBarmode();
  return (
    <HeaderNavBar>
      <ScrollContainer>
        <NavLink
          style={{
            ...navLinkStyle,
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
          }}
          activeClassName="active"
          to="/user"
        >
          <Logo
            style={{ margin: '0 0.5rem', width: '1rem', height: '1rem' }}
            width="1rem"
            height="1rem"
          />
          <FormattedMessage id="TALLY_HEADER" />
        </NavLink>
        {!barmode.enabled && (
          <>
            <NavLink style={navLinkStyle} activeClassName="active" to="/articles">
              <FormattedMessage id="ARTICLE_LINK" />
            </NavLink>
            {settings.payment.splitInvoice.enabled && (
              <NavLink
                style={navLinkStyle}
                activeClassName="active"
                to="/split-invoice"
              >
                <FormattedMessage id="SPLIT_INVOICE_LINK" />
              </NavLink>
            )}
            <NavLink style={navLinkStyle} activeClassName="active" to="/metrics">
              <FormattedMessage id="METRICS_LINK" defaultMessage="Metrics" />
            </NavLink>
            <NavLink activeClassName="active" to="/barmode">
              <FormattedMessage id="SETTINGS_LINK" defaultMessage="Barmode" />
            </NavLink>
          </>
        )}
      </ScrollContainer>
      <div
        style={{
          width: '7rem',
          minWidth: '7rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          textAlign: 'right',
        }}
      >
        <NavLink
          style={{
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'flex-end',
          }}
          activeClassName="active"
          to="/search-results"
        >
          <FormattedMessage id="SEARCH_RESULTS_LINK" defaultMessage="Search" />
          <SearchIcon style={{ marginLeft: '0.5rem' }} />
        </NavLink>
      </div>
    </HeaderNavBar>
  );
}
