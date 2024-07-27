import * as React from 'react';
import {
  Input,
  ResponsiveGrid,
  styled,
} from 'bricks-of-sand';
import { useCookies } from 'react-cookie';

export const useBarmode = () => {
  const [cookies, setCookie] = useCookies(['barmode', 'barmode_filter']);

  const setEnabled = (value: boolean) => {
    console.log('barmode', value);
    setCookie('barmode', value, { path: '/' });
  }

  const setFilter = (value: string) => {
    console.log('barmode_filter', value);
    setCookie('barmode_filter', value, { path: '/' });
  }

  const enabled = cookies.barmode;
  const filter = cookies.barmode_filter


  return {
    setEnabled,
    setFilter,
    enabled,
    filter,
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
