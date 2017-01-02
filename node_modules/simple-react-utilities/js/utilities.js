var ncUtilities = {
  /*****************
   * ARRAY METHODS *
   *****************/

  /**
   * if given a name property and an array containing objects which each have a name property, 
   * will return the first object with the matching name
   * 
   * @param  {array} arr  [array of objects]
   * @param  {string} name [name property in object]
   * @return {object}      [first object matching the name provided]
   */
  getObjectByName : function(arr,name) {
    var i = 0;
    for (i in arr) {
      if ('name' in arr[i]) {
        if (arr[i].name === name) {
          return arr[i];
        }
      }
     }
    return false;
  },

  /**
   * if given an array containing objects, a property name, and a value,
   * will return an array of objects each which contain the supplied property name and value 
   * 
   * @param  {array} arr  [description]
   * @param  {string} prop [description]
   * @param  {string} val  [description]
   * @param  {string} usePartialMatch  [description]
   * @return {array}      [array of objects matching search criteria]
   */
  getObjectsByProp : function(arr,propName,val,usePartialMatch) {
    var i = 0;
    var objects = [];
    var _this = this;

    function checkPartialMatch(str1,str2) {
      return usePartialMatch && _this.shrink(str1).indexOf(_this.shrink(str2)) > -1;
    }
    for (i in arr) {
      if (propName in arr[i]) {
        if (arr[i][propName] === val || checkPartialMatch(arr[i][propName],val)) {
          objects.push(arr[i]);
        }
      }
    }
    return objects.length > 0 ? objects : false;
  },

  /**
   * counts the number of times an value is in an array
   * @param  {array} arr  [array to search]
   * @param  {string} item [value to search for]
   * @return {number}      [number of times the value appears in the array]
   */
  countItemInArray : function(arr,item) {
    var i, l;
    var count = 0;

    if (Array.isArray(arr)) {
      l = arr.length;
      arr = arr.sort();

      for (i = 0; i < l; i += 1) {
        if (arr[i] === item) {
          count += 1;
        }
      }
    } else {
      count = NaN;
    }

    return count;
  },

  /**
   * DEPRICATED
   * if given a list of objects and an object, this will
   * find each matching object in that list and remove it
   * 
   * @param  {array} arr  [array to remove an item from]
   * @param  {object} obj [specific object to remove]
   * @return {array}      [new array without the specified object]
   */
  removeObject : function(arr,obj) {
    var i, l;
    var prop;

    if (Array.isArray(arr)) {
      l = arr.length;

      for (i=0; i<l; i+=1) {
        if (  arr[i] && 
              arr[i].value === obj.value && 
              arr[i].key === obj.key) {
              arr.splice(i,1);
        }
      }
    } else {
      arr = undefined;
    }

    return arr;
  },

  /**
   * NOTICE: this method has issues, but is currently being used in some places
   * the plan is to rewrite it so that it doesn't rely on properties named 'key' and 'value'
   * 
   * if given a list of objects and an object, this will
   * find each matching object in that list and remove it
   * 
   * @param  {array} arr  [array to remove an item from]
   * @param  {object} obj [specific object to remove]
   * @return {array}      [new array without the specified object]
   */
  removeObjectFromArray : function(arr,obj) {
    var i, l;
    var prop;
    var newArray = [];

    if (Array.isArray(arr)) {
      l = arr.length;

      for (i=0; i<l; i+=1) {
        if (  arr[i] && 
              arr[i].value && 
              arr[i].key &&
              arr[i].value === obj.value && 
              arr[i].key === obj.key) {
              console.log(arr[i]);
        } else {
          console.log(arr[i].value);
          newArray.push(arr[i]);
        }
      }
    } else {
      arr = undefined;
    }

    return newArray;
  },

  /**
   * removes duplicates from an array and returns the new array
   * @param  {array} array [array to remove duplicates from]
   * @return {array}       [array with duplicates removed]
   */
  arrayUnique : function(arr) {
      var a = false,
          i, j;

      if (Array.isArray(arr)) {
        a = arr.concat();

        for (i = 0; i < a.length; ++i) {
          for (j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
              a.splice(j--, 1);
            }
          }
        }  
      }

      return a;
  },

  /**
   * takes an array of objects and sorts them by a specified property
   * @param  {array} objects [list of objects]
   * @return {array}         [list of objects, sorted by given property]
   */
  sortObjectsByProp : function (objects,prop) {
    var i, l;
    var propsArray = [];
    var newObjectSort = [];

    if (Array.isArray(objects)) {
      l = objects.length;

      for (i=0; i<l; i+=1) {
        propsArray.push(objects[i][prop]);
      }

      propsArray.sort();

      for (i = 0, l = propsArray.length; i < l; i += 1) {
        newObjectSort.push(this.getObjectsByProp(objects,prop,propsArray[i],false)[0]); 
      }
    }

    return newObjectSort.length ? newObjectSort : false;
  },

  /**
   * This method seems ridiculous but its useful where I can't directly call an array in a jsx html block
   * gets an array from an object and returns it, optionally as a concatenated string
   * 
   * @param  {array} spells     [array of spell objects]
   * @param  {boolean} string   [true if expected return type is a string]
   * @return {array || string}  [array of strings, or string of arrays joined by commas]
   */
  getArrayFromObject : function(data,key,returnString) {
    var prop, items;

    if (Array.isArray(data[key])) {
      items = data[key];

      if (returnString) {
        items = items.join(', ');
      }
    }
    
    return items;
  },

  /******************
   * STRING METHODS *
   ******************/

   /**
   * checks if a string or array has a specific string
   * @param  {object} obj [object to check]
   * @param  {string} val [value to check for]
   * @return {boolean}     whether or not the object has the value
   */
  contains : function(obj,val) {
    if (obj.indexOf) {
      return obj.indexOf(val) > -1 ? true : false;
    }
  },

  /**
   * converts a string from any case to Title Case
   * @param  {string} str 
   * @return {string}     [string in title case]
   */
  titleCase : function(str) {
    var titleString = false;

    if (typeof str === "string") {
      str = str.replace(/_/gi,' ').toLowerCase().split(' ');

      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      str = str.join(' ')
            .replace(/Of/gi, 'of')
            .replace(/The/gi, 'the')
            .replace(/In/gi, 'in')
            .replace(/Is/gi, 'is');

      titleString = str.charAt(0).toUpperCase() + str.slice(1);
    }

    return titleString;
  },

  /**
   * removes spaces and converts a string to lowercase for easier matching
   * @param  {string} str [string to shrink]
   * @return {string}     [shrunken string]
   */
  shrink : function(str) {
    var myStr = str;
    return myStr.replace(/\s/g, '').toLowerCase();
  },


  /**************************
   * D&D SPECIFIC FORMULAS & METHODS *
   **************************/

   /**
   * gets the ability score modifier for given ability score
   * @param  {number} num Ability Score for which to get modifier
   */
  getAbilityScoreModifier : function(num) {
    return Math.floor((num - 10) / 2);
  },

   /**
   * gets a string to render for a D&D ability score
   * @param  {number} score [ability score]
   * @return {string}       [modifier]
   */
  getModifier : function(score) {
    var modifier = Math.floor((score - 10)/2);
    var operator = "+"
    if (modifier < 0) {
      operator = "-";
    }
    return operator+""+Math.abs(modifier);
  }  
}

if (module) {
  module.exports = ncUtilities
}

