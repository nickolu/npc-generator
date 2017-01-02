
var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require('../../../node_modules/simple-react-utilities/js/utilities.js');

import npcTraits from '../json/npc-traits.json';
import { TextInput } from '../../../node_modules/simple-react-forms/form-fields/text-input.js';
import { SubmitButton } from '../../../node_modules/simple-react-forms/form-fields/submit-button.js';

class Generator extends React.Component {
  
  /**
   * constructor for SpellBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);
    let traits = {};
    let allTraits = Object.keys(npcTraits.traits);

    for (let traitName in allTraits) {
      traits[allTraits[traitName]] = '['+allTraits[traitName]+']';
    }

    this.state = {
      lockedInputs : [],
      conditionals : {},
      rootValues : {},
      traits : traits
    };

    this.updateAll = this.updateAll.bind(this);
    this.updateState = this.updateState.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.replaceInput = this.replaceInput.bind(this);

    String.prototype.toProperCase = function() {
      return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace("Of ", "of ");
    }
  }

  /**
   * updates all values
   * each input which is not locked will be updated with a new random value
   */
  updateAll() {
    let inputEls = document.querySelectorAll('input.form-control');
    let objName = "";
    let _this = this;

    for (let obj in inputEls) {
      if (inputEls[obj] && typeof inputEls[obj].getAttribute === 'function') {
        objName = inputEls[obj].getAttribute("name");  
        _this.replaceInputWithRandom(objName);
      }
    }
  }

  /**
   * updates each property in the state with the value from its related input element
   * @param  {object || string} e - event object passed from the triggering event or name of property to update
   */
  updateState(e) {
    let inputName = "";
    let inputValue = "";
    let newState = {}

    if (typeof e === "string") {
      inputName = e;
      inputValue = document.querySelector('input[name='+inputName+']').value;
    } else {
      inputName = e.target.getAttribute('name');
      inputValue = e.target.value;
    }

    newState = Object.assign(this.state.traits,{
      [inputName] : inputValue
    })

    this.setState({
      traits : Object.assign({}, this.state.traits, newState)
    });
  }

  /**
   * gets a random item from array
   * @param  {array}  arr - array of items to pick from
   * @return {string}  
   */
  getRandom(arr) {
    let randomIndex = 0;
    let item = "";

    if (Array.isArray(arr)) {
      randomIndex = Math.round(Math.random() * (arr.length - 1));
    }

    if (arr && arr[randomIndex]) {
      return arr[randomIndex];  
    }
  }

  
  /**
   * replaces the value of target input with specified value
   * @param  {string} inputName - name of input/property
   * @param  {string} val       - value to replace with
   */
  replaceInput(inputName,val) {
    let inputEl = document.querySelector('[name='+inputName+']');
    
    inputEl.value = val;
    this.updateState(inputName);
  }

  /**
   * replaces the value of target input with a random value
   * @param  {string} inputName - name of input/property
   */
  replaceInputWithRandom(inputName) {
    let traitValues = npcTraits.traits[inputName];

    if (!utilities.contains(this.state.lockedInputs, inputName)) {
      this.replaceInput(inputName,this.getRandomTrait(inputName));
    }
  }


  getRandomTrait(traitName) {
    let traitValues = npcTraits.traits[traitName];
    let traitOptions = npcTraits.options[traitName] || false;
    let randomVal = "";
    let _this = this;

    if (traitOptions) {
      resolveOptions();
    } else if (Array.isArray(npcTraits.traits[traitName])) {
      randomVal = _this.getRandom(npcTraits.traits[traitName]);

      return randomVal;
    }

    function resolveOptions() {
      resolveDependencies();
      resolveRanges();
      resolveUnwantedMatches();
      resolveConditionals();
      makeCombinations();
    }

    function resolveDependencies() {
      let dependency = "";
      let dependencyVal = "";
      let propsArray = [];

      if (traitOptions.dependencies) {
        dependency = _this.getRandom(traitOptions.dependencies) || [];  // choose random dependency
        
        
        if (_this.state.traits[dependency]) {
          dependencyVal = _this.state.traits[dependency].toLowerCase();
          traitValues = npcTraits.traits[traitName][dependencyVal];  
          
          if (traitOptions.subdependencies && traitOptions.subdependencies[dependencyVal]) {
            dependencyVal = traitOptions.subdependencies[dependencyVal];
            traitValues = traitValues[_this.state.traits[dependencyVal].toLowerCase()];
          }
        } else {
          for (let prop in npcTraits.traits[traitName]) {
            propsArray.push(prop);
          }
          dependencyVal = _this.getRandom(propsArray) || "other";
          traitValues = npcTraits.traits[traitName][dependencyVal];  
        }  
      }
    }

    function resolveRanges() {
      if (traitOptions.isRange) {
        randomVal = Math.round(Math.random() * (traitValues[1] - traitValues[0]) + traitValues[0]);
      } else {
        randomVal = _this.getRandom(traitValues);  
      }
    }

    function resolveUnwantedMatches() {
      let shouldNotEqual = traitOptions.shouldNotEqual || "";
      let i = 0;

      while (randomVal && randomVal === _this.state.traits[shouldNotEqual]) {
        randomVal = _this.getRandom(traitValues);
        if (i++ > 100) {
          break;
        }
      }
    }

    function resolveConditionals() {
      if (traitOptions.conditionals) {
        for (let condition in traitOptions.conditionals) {
          if (randomVal.toLowerCase() === condition)  {
            randomVal = _this.getRandom(traitOptions.conditionals[condition]);
            
            _this.state.rootValues[randomVal] = condition;
          }
        }
      }
    }

    function makeCombinations() {
      let propName = traitName;
      let propVal = "";

      if (traitOptions.combine) {
        propVal = _this.state.rootValues[randomVal] || randomVal;

        traitOptions.combine.traits.forEach(function(trait){
          propName += traitOptions.combine.separator + trait;
          propVal += traitOptions.combine.separator + _this.state.traits[trait];
          propVal = propVal.toLowerCase();
        });

        _this.state.traits[propName] = propVal;
      }
    }

    return randomVal;
  }

  /**
   * renders a trait
   * @param  {function} onUpdate - function to run on update
   * @return {react} - react element
   */
  renderInput(traitName,label) {
    let _this = this;

    function replace() {
      _this.replaceInputWithRandom(traitName);
    }

    function toggleLock(e) {
      let isLocked = utilities.contains(_this.state.lockedInputs,traitName);

      if (isLocked) {
        e.target.className = e.target.className.replace('locked','unlocked');
        _this.state.lockedInputs.splice(_this.state.lockedInputs.indexOf(traitName),1);

      } else {
        e.target.className = e.target.className.replace('unlocked','locked');
        _this.state.lockedInputs.push(traitName);

      }
    }

    return <div>
      <span className="trait-label">{label}</span>
      <SubmitButton 
       type="text" 
       cssClass="btn-lock unlocked glyphicon glyphicon-lock"
       label="" 
       name="lock_input" 
       onUpdate={toggleLock}
      />
      <TextInput 
       type="text" 
       name={traitName}
       onChange={_this.updateState}
      />
      <SubmitButton 
       type="text" 
       cssClass="btn-refresh glyphicon glyphicon-refresh"
       label="" 
       name="get_random" 
       onUpdate={replace}
      />
    </div>
  }

  renderMultipleInputs(options) {
    options = options || {};
    let names = options.names || [];
    let range = options.range || false;
    let traitName = "";

    if (!names.length) {
      for (traitName in npcTraits.traits) {
        names.push(traitName);
      }
    }

    if (range && range.length === 2) {
      let min = range[0];
      let max = range[1];

      names.splice(0,min);
      names.splice(max,names.length);
    }

    return <div>{names.map((trait) => <div key={trait}>{this.renderInput(trait,trait.toProperCase().replace(/\_/g," "))}</div>)}</div>
  }
  
  /**
   * puts everything in the DOM
   */
	render() {
    let _this = this;
    let genderPronounPossessive = getGenderPronoun(_this.state.traits.gender).possessive;
    let genderPronounPersonal = getGenderPronoun(_this.state.traits.gender).personal;

    function getGenderPronoun(gender) {
      let pronoun = "";
      let possessive = "";

      gender = gender || "";

      switch (gender.toLowerCase()) {
        case "male" : 
          return {
            personal : "He",
            possessive : "His"
          }
        case "female" : 
          return {
            personal : "She",
            possessive : "Her"
          }
        default : 
          return {
            personal : "This character",
            possessive : "Their"
          }
      }
    }

    function renderDescription(traitName,useProperCase,prefix) {
      let traitValue = _this.state.traits[traitName].toLowerCase();
      let traitDescription = traitValue;
      let vowels = ["a","e","i","o","u"];

      prefix = traitDescription && prefix ? prefix : "";

      if (npcTraits.descriptions[traitName] && npcTraits.descriptions[traitName][traitValue]) {
        traitDescription = npcTraits.descriptions[traitName][traitValue].toLowerCase();
      }

      if (prefix === "a ") {
        vowels.map(function(num){
          if (traitDescription.split('')[0].toLowerCase() === ""+num)  {
            prefix = "an ";
          }
        });
      }

      if (useProperCase) {
        traitDescription = traitDescription.toProperCase()
      }

      return <span className="keyword">{prefix+traitDescription}</span>
    }
    
    return  <div className="container generator">
              <div className="row">
                <div className="col-sm-12">
                  <h2>NPC Generator</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 description-container">
                  <p>You see {renderDescription("physique",false,"a ")} {renderDescription("gender")} {renderDescription("race",true)} with {renderDescription("distinguishing_marks")} wearing the clothes of {renderDescription("occupation",false,"a ")}. {genderPronounPersonal} looks to be in {genderPronounPossessive.toLowerCase()} {renderDescription("age_group")}, has {renderDescription("hair_color")} hair, and is {renderDescription("height")} for a {renderDescription("gender")} {renderDescription("race", true)}. You can see {renderDescription("emotion")} in {genderPronounPossessive.toLowerCase()} {renderDescription("eye_color")}, {renderDescription("eye_shape")} eyes.</p>

                  <p>{renderDescription("name",true)}{renderDescription("surname",true," ")} has a {renderDescription("alignment_lawful")}-{renderDescription("alignment_moral")} alignment and is {renderDescription("high_ability")} yet {renderDescription("low_ability")}. Impressively, {genderPronounPersonal.toLowerCase()} is {renderDescription("talents")}. {renderDescription("name",true)} often {renderDescription("mannerisms")} and has a {renderDescription("interaction_traits")} way of speaking. {genderPronounPersonal} is always {renderDescription("bonds")} and values {renderDescription("ideals")} more than anything, but is troubled by {genderPronounPossessive.toLowerCase()} {renderDescription("flaws")}.</p>

                  <p>{renderDescription("name",true)} has a {renderDescription("family_relationship")} relationship with {genderPronounPossessive.toLowerCase()} family. {genderPronounPersonal} is {renderDescription("maritial_status")} with {renderDescription("children")}. The rest of {genderPronounPossessive.toLowerCase()} family consists of {renderDescription("siblings")}, {renderDescription("cousins")}, {renderDescription("aunts")}, {renderDescription("uncles")}, and {renderDescription("parents")}.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <br />
                  <SubmitButton 
                   type="text" 
                   label="Randomize All" 
                   name="randomize_all" 
                   onUpdate={this.updateAll}
                  />

                  {this.renderMultipleInputs(
                    {
                      names : [
                        "gender",
                        "race",
                        "name",
                        "surname",
                        "alignment_lawful",
                        "alignment_moral",
                        "distinguishing_marks",
                        "high_ability",
                        "low_ability",
                        "talents",
                        "mannerisms",
                        "interaction_traits",
                        "bonds",
                        "flaws",
                        "ideals",
                        "emotion",
                        "social_class",
                        "occupation",
                        "useful_knowledge"
                      ]
                    }
                  )}

                </div>
                <div className="col-sm-6">

                  <h3>Physical</h3>
                  {this.renderMultipleInputs(
                    {
                      names : [
                        "eye_color",
                        "eye_shape",
                        "hair_color",
                        "age_group",
                        "physique",
                        "height"
                      ]
                    }
                  )}
                 

                  <h3>Family</h3>
                  {this.renderMultipleInputs(
                    {
                      names : [
                        "parents",
                        "siblings",
                        "cousins",
                        "aunts",
                        "uncles",
                        "children",
                        "family_relationship",
                        "maritial_status"
                      ]
                    }
                  )}
                  
                </div>
              </div>
            </div>;
	}
}

ReactDOM.render(<Generator/>, document.querySelector('main'));
