var React = require('react');

export class SubmitButton extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
  	var cssClass = "btn ";

  	if (this.props.cssClass) {
  		cssClass += this.props.cssClass;	
  	}
  	

    return  <div className={cssClass} data-key={this.props.value} onClick={this.props.onUpdate}>{this.props.label}</div>
  }
}
