import { Footer } from 'bricks-of-sand';
import * as React from 'react';
import { GitHubIcon } from '../ui/icons/git-hub';
import { useBarmode } from '../settings/barmode';

export function MainFooter(): JSX.Element {

  const barmode = useBarmode();

  const content = (
    <Footer>
      <div>
        strichliste-web (MIT License, by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/schinken"
        >
          schinken
        </a>{' '}
        and{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/sanderdrummer"
        >
          sanderdrummer
        </a>
        )
      </div>
      <div>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/strichliste"
        >
          <GitHubIcon /> Code
        </a>
      </div>
    </Footer>
  );

  if (barmode.footerHrefDisabled === true || barmode.enabled === true) {
    return filterFooter(content);
  } else {
    return content;
  }
}

const filterFooter = (content: JSX.Element): JSX.Element => {

  return React.cloneElement(content, {
    ...content.props,
    children: React.Children.map(content.props.children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === 'a') {
          // get inner text of a tag
          const text = (child.props as { children: React.ReactNode }).children;
          return (
            text
          );
        } else {
          return filterFooter(child);
        }
      }
      return child;
    }),
  });
};
