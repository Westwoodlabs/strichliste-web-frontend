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
  };
  public inputRef = React.createRef<HTMLInputElement>();

  public componentDidMount(): void {
    document.addEventListener('keypress', this.detection);

  }

  public componentWillUnmount(): void {
    document.removeEventListener('keypress', this.detection);
  }

  public detection = (event: KeyboardEvent): void => {
    const key = event.key;
    var preventOnChange = false;

    clearTimeout(this.state.timeout);

    if (document.activeElement instanceof HTMLInputElement && document.activeElement.dataset.inputType !== 'scanner') {
      if (key === 'Enter' && this.state.maybeBarcode !== '') {
        event.preventDefault();
        preventOnChange = true;
      }
    }

    console.log("key", key, "preventOnChange", preventOnChange);

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

    }

    console.log("maybeBarcode", this.state.maybeBarcode);

    if (this.inputRef.current && this.props.validator.test(this.state.maybeBarcode) && document.activeElement instanceof HTMLInputElement) {
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
        <div
          style={{ position: "absolute", float: "left" }}><input
            style={{ opacity: 0 }}
            value=""
            onChange={() => { }}
            ref={this.inputRef}
            data-input-type="scanner"
            type="text"
            hidden
            tabIndex={-1}
            id="scanner"
          /></div>
      );
    }
    return (
      <>
        <div
          style={{ position: "absolute", float: "left" }}><input
            style={{ opacity: 0 }}
            value=""
            onChange={() => { }}
            ref={this.inputRef}
            type="text"
            data-input-type="scanner"
            hidden
            tabIndex={-1}
            id="scanner"
          /></div>
        {this.props.render(this.state.barcode)}
      </>
    );
  }
}
