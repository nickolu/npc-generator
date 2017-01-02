var React = require('react');

export class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.onChange = this.onChange.bind(this);
  };

  onChange(e) {
    this.setState({
      userInput : [e.target.value]
    });
  }

  render() {
    return  <div className="form-field">
              <label>{this.props.label}
                <input type={this.props.type} className="form-control" name={this.props.name} onChange={this.props.onChange}/>
              </label>
            </div>
  }
}
