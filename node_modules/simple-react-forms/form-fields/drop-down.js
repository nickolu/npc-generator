var React = require('react');

export class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
  };

  onChange(e) {
    this.setState({
      selection : e.target.value
    });

    this.props.onUpdate(e);
  };

  render() {
    let concatClasses = this.props.className+" drop-down form-field"
    
    function getChoiceLabel(choices) {
      if (choices.label) {
        return choices.label;
      } else if (choices.name) {
        return choices.name;
      }
      return "";
    }

    return  <div className={concatClasses}>
              <select name={this.props.name} value={this.state.selection} onChange={this.onChange}>
                <option value="" defaultValue="selected">{this.props.label}</option>
                {this.props.choices.map(choice => <option key={choice.name} data-index={choice.id} value={choice.name}>{getChoiceLabel(choice)}</option>)}
              </select>
            </div>
  }
}
