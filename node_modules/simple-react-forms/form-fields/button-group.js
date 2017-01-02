var React = require('react');
var utilities = require('../node_modules/simple-react-utilities/js/utilities.js');
import { SubmitButton } from './submit-button.js';

export class ButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    var _this = this;
    _this.state = {
      selection : ''
    };

    _this.onChange = this.onChange.bind(this);
    
  };

  onChange(e) {
    this.setActiveButton(e);
  }

  setActiveButton(e) {
    var groupClass = utilities.shrink(this.props.groupLabel);
    var active = document.querySelector("."+groupClass+".btn.active");
    var isActive = e.target.className.indexOf("active") > -1;

    console.log("."+groupClass+".btn.active");
    if (this.props.multiSelect) {
      if (isActive) {
        e.target.className = e.target.className.replace(/active/g,'');
      } else {
        e.target.className += " active"
      }
    } else {
      if (isActive) {
        e.target.className = groupClass + " btn";
      } else if (active) {
        active.className = active.className.replace(/active/g,""); 
        e.target.className += " active"
      } else {
        e.target.className += " active"
      }
    }
  }

  renderButton(choice) {
    var choiceString = typeof choice === "object" ? choice.val : choice;
    var label = typeof choice === "object" ? choice.label : choice;
    var cssClass = utilities.shrink(this.props.groupLabel)+" "+utilities.shrink(choiceString)+" btn";
    var _this = this;

    function onChange(e) {
      var isActive = e.target.className.indexOf("active") > -1;
      _this.props.onUpdate(e,choice,isActive);
      _this.setActiveButton(e);
    }

    return <SubmitButton key={choiceString} cssClass={cssClass} value={choiceString} label={label} onUpdate={onChange} />
  }

  render() {
    var _this = this;
    var cssClass = utilities.shrink(this.props.groupLabel) + " btn";


    return  <div>
              {this.props.choices.map(choice => _this.renderButton(choice))}
            </div>
  }
}
