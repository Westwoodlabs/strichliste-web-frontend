import * as React from 'react';
import {
  Input,
  ResponsiveGrid,
  styled,
} from 'bricks-of-sand';
import { useCookies } from 'react-cookie';

export const useBarmode = () => {
  const [cookies, setCookie] = useCookies(['barmode', 'barmode_filter', 'barmode_hidden', 'disable_footer_href']);

  const setEnabled = (value: boolean) => {
    console.log('barmode', value);
    setCookie('barmode', value, { path: '/' });
  }

  const setFilter = (value: string) => {
    console.log('barmode_filter', value);
    setCookie('barmode_filter', value, { path: '/' });
  }

  const hideBarmode = (value: boolean) => {
    console.log('barmode_hidden', value);
    setCookie('barmode_hidden', value, { path: '/' });
  }

  const disableFooterHref = (value: boolean) => {
    console.log('disable_footer_href', value);
    setCookie('disable_footer_href', value, { path: '/' });
  }

  const enabled = cookies.barmode;
  const filter = cookies.barmode_filter;
  const hidden = cookies.barmode_hidden;
  const footerHrefDisabled = cookies.disable_footer_href;


  return {
    setEnabled,
    setFilter,
    hideBarmode,
    disableFooterHref,
    enabled,
    filter,
    hidden,
    footerHrefDisabled
  };
};

const GridContainer = styled('div')({
  maxWidth: '30em',
  margin: '2rem auto',
  padding: '0 1rem',
});

interface Props {
}


export const Barmode = (props: Props) => {

  const barmode = useBarmode();

  return (
    <GridContainer>
      <ResponsiveGrid
        columns="auto 1fr"
        rows="min-content"
        gridGap="1rem"
        margin="1rem 0"
        alignItems="center"
      >
        <div>Disable Footer Href</div>
        <input
          checked={barmode.footerHrefDisabled}
          onChange={e => barmode.disableFooterHref(e.target.checked)}
          type="checkbox" />
        <div>Hide Barmode</div>
        <input checked={barmode.hidden} onChange={e => barmode.hideBarmode(e.target.checked)} type="checkbox" />
        <div>Enable Barmode</div>
        <input
          checked={barmode.enabled}
          onChange={e => barmode.setEnabled(e.target.checked)}
          type="checkbox"
        />
        <div>Article filter</div>
        <Input
          value={barmode.filter}
          onChange={e => barmode.setFilter(e.target.value)}
          minLength={1}
          maxLength={64}
          required
          type="text"
        />
      </ResponsiveGrid>
    </GridContainer >
  );
};
