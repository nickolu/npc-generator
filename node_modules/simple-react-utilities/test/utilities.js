describe("utilities", function() {
	var utilities = ncUtilities;

	/**
	 * array of d&d spells to use for testing array methods
	 * @type {Array}
	 */
	var dndSpells = [ 
		{
			"name": "Abi-Dalzim's Horrid Wilting",
			"page": "ee 15",
			"range" : "30 feet"
		},
		{
			"name": "Absorb Elements",
			"page": "ee 15",
			"range": "Self",
		},
		{
			"name": "Acid Splash",
			"page": "phb 211",
			"range": "60 feet",
		},
		{
			"name": "Aganazzar's Scorcher",
			"page": "ee 15",
			"range": "30 feet",
		},
		{
			"name": "Aid",
			"page": "phb 211",
			"range": "30 feet",
		},
		{
			"name": "Alarm",
			"page": "phb 211",
			"range": "30 feet",
		},
		{
			"name": "Alter Self",
			"page": "phb 211",
			"range": "Self",
		},
		{
			"name": "Animal Friendship",
			"page": "phb 212",
			"range": "30 feet",
		},
		{
			"name": "Animal Messenger",
			"page": "phb 212",
			"range": "30 feet",
		},
		{
			"name": "Animal Messenger",
			"page": "phb 102",
			"range": "30 feet",
		},
		{
			"name": "Animal Messenger",
			"page": "phb 330",
			"range": "30 feet",
		}
	];

	describe("getObjectByName", function() {
		
		it('should return the correct object', function(){
			var dndSpell = utilities.getObjectByName(dndSpells, "Animal Messenger");
			
			expect(dndSpell).to.be.an('object');
			expect(dndSpell.name).to.equal('Animal Messenger');
			expect(dndSpell.page).to.equal('phb 212'); 
		});

		it('should return false if no object exists with the given name', function(){
			var dndSpell = utilities.getObjectByName(dndSpells, "Poopy Butt");
			
			expect(dndSpell).to.equal(false);
		});

		it('should not alter the given array', function(){
			expect(dndSpells.length).to.equal(11);
			expect(dndSpells[0].name).to.equal('Abi-Dalzim\'s Horrid Wilting');
			expect(dndSpells[8].name).to.equal('Animal Messenger');
		});


	});

	describe('getObjectsByProp', function(){
		it('should return all of the matching objects', function() {
			var matchingSpells = utilities.getObjectsByProp(dndSpells,'name','Animal Messenger',false);

			expect(matchingSpells.length).to.equal(3);
		});

		it('should allow partial value when "partial match" is set to true', function() {
			var matchingSpells = utilities.getObjectsByProp(dndSpells,'name','animal',true);

			expect(matchingSpells.length).to.equal(4);
		});

		it('should return false when no match found', function() {
			var matchingSpells = utilities.getObjectsByProp(dndSpells,'name','weroijos',false);
			var matchingSpellsPartialMatch = utilities.getObjectsByProp(dndSpells,'name','weroijos',true);

			expect(matchingSpells).to.equal(false);
			expect(matchingSpellsPartialMatch).to.equal(false);
		});

	});

	describe('countItemInArray', function(){
		var testArray = ['a','a','b','c','c','c',1,1,2,2,2,3];

		it('should count accurately',function(){
			expect(utilities.countItemInArray(testArray,'c')).to.equal(3);
			expect(utilities.countItemInArray(testArray,'b')).to.equal(1);
			expect(utilities.countItemInArray(testArray,2)).to.equal(3);	
		});

		it('should return 0 if item not in array', function(){
			expect(utilities.countItemInArray(testArray,'x')).to.equal(0);
		});

		it('should return NaN if first arg is not an array', function(){
			expect(isNaN(utilities.countItemInArray('hello world','x'))).to.equal(true);
		});
		
	});

	describe('arrayUnique', function(){
		var testArray = ['a','a','b','b','c','c','c','d','e','f','f',1,1,1,2,3,3,3,4];
		var uniqueArray = utilities.arrayUnique(testArray);

		it('should not have any duplicate values', function(){
			var i, l = uniqueArray.length,
				hasDuplicate = false;

			uniqueArray.sort();

			for (i = 1; i < l; i++) {
				if (uniqueArray[i] === uniqueArray[i-1]) {
					hasDuplicate = true;
				}
			}

			expect(hasDuplicate).to.equal(false);
			expect(uniqueArray.length).to.equal(['a','b','c','d','e','f',1,2,3,4].length);
		});

		it('should not modify the array argument passed in', function(){
			expect(testArray.length).to.equal(['a','a','b','b','c','c','c','d','e','f','f',1,1,1,2,3,3,3,4].length);
		});

		it('should not remove an element that is already unique', function(){
			expect(uniqueArray.indexOf('d') > 0).to.equal(true);
		});
		
		it('should return false if the first argument is not an array', function(){
			expect(utilities.arrayUnique('banana')).to.equal(false);
		});
	});

	describe('sortObjectsByProp', function(){
		var testObjects = [
			{
				'name' : 'd',
				'number' : 4
			},
			{
				'name' : 'e',
				'number' : 3
			},
			{
				'name' : 'b',
				'number' : 5
			},
			{
				'name' : 'a',
				'number' : 2
			},
			{
				'name' : 'c',
				'number' : 1
			}
		];

		var sortedByName = utilities.sortObjectsByProp(testObjects, 'name');
		var sortedByNumber = utilities.sortObjectsByProp(testObjects, 'number');


		it('s first object should have the lowest value for given prop', function(){
			expect(sortedByName[0]['name']).to.equal('a');
			expect(sortedByNumber[0].number).to.equal(1);
		});

		it('s last object should have the highest value for given prop', function(){
			expect(sortedByName[4]['name']).to.equal('e');
			expect(sortedByNumber[4]['number']).to.equal(5);
		});

		it('should return false if the first argument is not an array',function(){
			expect(utilities.sortObjectsByProp('hello world', 'name')).to.equal(false);
		});

	});

	describe('getArrayFromObject', function(){
		var testObject = {
			"myArray" : ['finley','is','cute'],
			"myString" : "finley is cute"
		};

		it('should return undefined if the key value pair does not provide an array from target object', function(){
			var nullArray = utilities.getArrayFromObject(testObject,"myString",true);

			expect(nullArray).to.be.undefined;
		});

		it('should return an array if all goes accordiong to plan', function(){
			expect(utilities.getArrayFromObject(testObject,"myArray",false)).to.equal(testObject["myArray"]);
		});

		it('should return a string if true is given for the third argument', function(){
			expect(utilities.getArrayFromObject(testObject,"myArray",true)).to.equal(testObject["myArray"].join(', '));
		});
	});

	describe('contains', function(){
		it('should return true if given a string for both arguments, and the first string contains the second string', function(){
			var myString = "this is cool";

			expect(utilities.contains(myString,"is coo")).to.equal(true);
			expect(utilities.contains(myString,"this is")).to.equal(true);
			expect(utilities.contains(myString,"his")).to.equal(true);
			expect(utilities.contains(myString,"flowers")).to.equal(false);

		});

		it('should not return true even if the letter casing do not match', function(){
			var myString = "this is cool";
	
			expect(utilities.contains(myString,"This is")).to.equal(false);
		});

		it('should return true if one of the items in the array is equal to the given string', function(){
			 var myArray = ['finley','is','cute'];

			 expect(utilities.contains(myArray,'cute')).to.equal(true);
		});

		it('should not return true if the first argument is an array, and the second is only a partial match', function(){
			 var myArray = ['finley','is','cute'];

			 expect(utilities.contains(myArray,'cut')).to.equal(false);
		});

		it('should return undefined if the first argument does not have the indexOf method',function(){
			var myObject = {};
			var myArray = ['finley','is','cute']

			if (!myObject.indexOf) {
				expect(utilities.contains(myObject,'cut')).to.be.undefined;		
			}

		});
	});

	describe('titleCase', function(){
		var myString = "Finley is one of the_best in the_world";
		var titleString = utilities.titleCase(myString);
		var splitString = titleString.split(' ');
		
		it('should have each word begin with a capital letter', function(){
			expect(splitString[2].charAt(0)).to.equal("O");
			expect(splitString[2].charAt(0)).not.to.equal("o");
		});

		it('should have underscores replaced with spaces', function(){
			expect(titleString.indexOf('_')).to.equal(-1);
			expect(splitString.length).to.equal(9);	
		});

		it('should not capitalize the words "the", "in", "of", or "is"', function(){
			expect(splitString[1]).to.equal("is");
			expect(splitString[3]).to.equal("of");
			expect(splitString[4]).to.equal("the");
			expect(splitString[6]).to.equal("in");

			expect(splitString[1]).not.to.equal("Is");
			expect(splitString[3]).not.to.equal("Of");
			expect(splitString[4]).not.to.equal("The");
			expect(splitString[6]).not.to.equal("In");
		});

		it('should return false if first argument is not a string', function(){
			expect(utilities.titleCase({'name' : 'super cool baby'})).to.equal(false);
		});
	});

	describe('shrink', function(){
		var myString = "Finley is one of the_best in the_world";
		var myShrink = utilities.shrink(myString);

		it('should not have any spaces', function(){
			expect(myShrink.indexOf(' ')).to.equal(-1);
		});

		it('should be all lowercase', function(){
			var allLowerCase = true;
			var myShrinkArray = myShrink.split();
			var i, l = myShrinkArray.length;
			
			for (i = 0; i < l; i++) {
				if (myShrinkArray[i] !== myShrinkArray[i].toLowerCase()) {
					allLowerCase = false;
					break;
				}
			}

			expect(allLowerCase).to.equal(true);
		});
	});

	describe('getAbilityScoreModifier', function(){
		var abilityScores = [
			{
				'input' : 10,
				'expected_modifier' : 0,
				'operator' : ''
			},
			{
				'input' : 12,
				'expected_modifier' : 1,
				'expected_operator' : '+'
			},
			{
				'input' : 6,
				'expected_modifier' : -2,
				'expected_operator' : '-'
			},
			{
				'input' : 0,
				'expected_modifier' : -5,
				'expected_operator' : '-'
			},
			{
				'input' : 10000,
				'expected_modifier' : 4995,
				'expected_operator' : '+'
			}
		];

		it('should get the right value', function(){
			var i, input, l = abilityScores.length;

			for (i = 0; i < l; i++) {
				input = utilities.getAbilityScoreModifier(abilityScores[i].input);
				expect(Number(input)).to.equal(abilityScores[i].expected_modifier)	
			}
		});
	});

	describe('getModifier', function(){
		var abilityScores = [
			{
				'input' : 10,
				'expected_modifier' : 0,
				'expected_operator' : ''
			},
			{
				'input' : 12,
				'expected_modifier' : 1,
				'expected_operator' : '+'
			},
			{
				'input' : 6,
				'expected_modifier' : -2,
				'expected_operator' : '-'
			},
			{
				'input' : 0,
				'expected_modifier' : -5,
				'expected_operator' : '-'
			},
			{
				'input' : 10000,
				'expected_modifier' : 4995,
				'expected_operator' : '+'
			}
		];

		it('should get the right value', function(){
			var i, input, l = abilityScores.length;

			for (i = 0; i < l; i++) {
				input = utilities.getModifier(abilityScores[i].input);
				expect(Number(input)).to.equal(abilityScores[i].expected_modifier)	
			}
		});

		it('should include the correct operator', function(){
			var i, input, operator, l = abilityScores.length;

			for (i = 0; i < l; i++) {
				var input = utilities.getModifier(abilityScores[i].input);
				if (abilityScores[i].input !== 10) {
					operator = input.charAt(0);
					expect(operator).to.equal(abilityScores[i].expected_operator)		
				} else {
					expect(input.toString().charAt(0)).to.be.a.number;
				}
			}
		});
	});	
});
