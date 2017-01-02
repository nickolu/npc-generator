var React = require('react');

export class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection : ''
    };

    this.onChange = this.onChange.bind(this);
  };

  onChange(e) {
    this.setState({
      selection : e.target.value
    });
    e.target.customData = {};
    e.target.customData.key = this.props.groupName;
    
    this.props.onUpdate(e);
  }

  render() {

    return  <div className={this.props.groupName}>
              <h3>{this.props.groupLabel}</h3>
              {this.props.choices.map(choice => <div key={choice.value}><label>
                     <input type="radio" className={this.props.groupName} name={this.props.groupName}
                       value={choice.value}
                       checked={this.state.selection === choice.value}
                       onClick={this.onChange}  /> {choice.name}
                  </label></div>
              )}
            </div>
            
  }
}
