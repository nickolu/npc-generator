var React = require('react');

export class CheckBoxGroup extends React.Component {
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

    this.props.onUpdate(e);
  }

  limitOptions(optionsLimit, id) {
    let checkedNumber = document.querySelectorAll('.'+this.props.groupName+':checked').length || 0;
    let thisCheckBox = document.querySelector('.'+this.props.groupName+'[data-id='+id+']');
    optionsLimit = optionsLimit < 1 ? 1 : optionsLimit;

    if (thisCheckBox && !thisCheckBox.checked) {
      if (checkedNumber >= optionsLimit) {
        return "disabled";
      }
    }

    return "";
  }

  render() {
    var key = 0;
    var chooseText = "";

    if (this.props.optionsLimit > 0) {
      chooseText = "(choose "+this.props.optionsLimit+")";
    }

    return  <div className={this.props.cssClass}>
              <h5>{this.props.groupLabel}</h5>
              <p className="info">{chooseText}</p>
              {this.props.choices.map(choice => <div key={choice.id}>
                    <label>
                       <input
                         type="checkbox"
                         disabled={this.limitOptions(this.props.optionsLimit, choice.id)}
                         className={this.props.groupName}
                         defaultChecked={choice.checked}
                         name={choice.name}
                         value={choice.value}
                         data-id={choice.id}
                         onClick={this.props.onUpdate}
                       /> {choice.label}
                    </label>
                  </div>
              )}
            </div>
  }
}
