import React from 'react';

interface State {
  barcode: string;
  maybeBarcode: string;
  timeout?: NodeJS.Timer | number;
}

interface Props {
  render?(value: string): JSX.Element;
  onChange?(value: string): void;
  charset: RegExp;
  validator: RegExp;
}

export class Scanner extends React.Component<Props, State> {
  public state = {
    barcode: '',
    maybeBarcode: '',
    timeout: undefined,
    i: 0,
  };
  public inputRef = React.createRef<HTMLInputElement>();

  public componentDidMount(): void {
    document.addEventListener('keypress', this.detection);

  }

  public componentWillUnmount(): void {
    document.removeEventListener('keypress', this.detection);
  }

  public detection = (event: KeyboardEvent): void => {
    console.log('i', this.state.i++);
    const key = event.key;
    let preventOnChange = false;

    clearTimeout(this.state.timeout);

    // console.log(document.activeElement, this.inputRef.current, this.state.maybeBarcode);

    console.log('key', key);

    if (this.inputRef.current !== document.activeElement && document.activeElement && document.activeElement.tagName === 'INPUT') {
      if (key === 'Enter' && this.state.maybeBarcode !== '') {
        event.preventDefault();
        preventOnChange = true;
      }
    }

    if (key === 'Enter' && this.props.validator.test(this.state.maybeBarcode)) {
      this.setState(state => ({
        barcode: state.maybeBarcode,
        maybeBarcode: '',
      }));
      if (this.props.onChange && preventOnChange === false) {
        this.props.onChange(this.state.barcode);
      }
    } else if (key.length == 1 && this.props.charset.test(key)) {
      this.setState(state => ({
        barcode: '',
        maybeBarcode: state.maybeBarcode + key,
      }));
      console.log('maybeBarcode', this.state.maybeBarcode);
    }

    if (this.inputRef.current && this.props.validator.test(this.state.maybeBarcode)) {
      console.log("change focus...")
      this.inputRef.current.focus();
    }

    const id = setTimeout(() => {
      this.setState({ maybeBarcode: '' });
    }, 300);

    this.setState({ timeout: id });
  };

  public render(): JSX.Element | null {
    if (!this.props.render) {
      return (
        <input
          style={{ opacity: 0 }}
          value=""
          onChange={() => { }}
          ref={this.inputRef}
          type="text"
          hidden
          tabIndex={-1}
        />
      );
    }
    return (
      <>
        <input
          style={{ opacity: 0 }}
          value=""
          onChange={() => { }}
          ref={this.inputRef}
          type="text"
          hidden
          tabIndex={-1}
        />
        {this.props.render(this.state.barcode)}
      </>
    );
  }
}
