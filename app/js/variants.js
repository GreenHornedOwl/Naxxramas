var variants = [
  {
    "id": "A1.B2.C1",
    "name": "GENMY"
  },
  {
    "id": "A1.B2.C2",
    "name": "EXIAND"
  },
  {
    "id": "A1.B2.C3",
    "name": "TYPHONICA"
  },
  {
    "id": "A1.B3.C2",
    "name": "BEDLAM"
  },
  {
    "id": "A1.B3.C3",
    "name": "PERMADYNE"
  },
  {
    "id": "A1.B3.C4",
    "name": "ELECTONIC"
  },
  {
    "id": "A2.B1.C1",
    "name": "GOLISTIC"
  },
  {
    "id": "A2.B1.C2",
    "name": "GYNKO"
  },
  {
    "id": "A2.B1.C3",
    "name": "KENGEN"
  },
  {
    "id": "A2.B1.C4",
    "name": "XYQAG"
  },
  {
    "id": "A2.B2.C1",
    "name": "DUOFLEX"
  },
  {
    "id": "A2.B2.C2",
    "name": "GENMOM"
  },
  {
    "id": "A2.B2.C3",
    "name": "HARMONEY"
  },
  {
    "id": "A2.B3.C4",
    "name": "CYTRAK"
  },
  {
    "id": "A2.B4.C1",
    "name": "GRUPOLI"
  },
  {
    "id": "A3.B1.C1",
    "name": "OCTOCORE"
  },
  {
    "id": "A3.B2.C1",
    "name": "NETERIA"
  },
  {
    "id": "A3.B3.C1",
    "name": "EXOSPEED"
  },
  {
    "id": "A4.B1.C3",
    "name": "SQUISH"
  },
  {
    "id": "A4.B3.C4",
    "name": "INSURITY"
  }
]

HandleVariants = function(list){
	var variants = list;
	var selects = getSelects();
	var firstVariant = _.split(variants[0].id,'.');
	
	// Add events for options show/hide
	$('option').on("hide", function(){
		$(this).addClass("hidden");
	});
	$('option').on("show", function(){
		$(this).removeClass("hidden");
	});


	// Add Event Listeners
	_.map(selects, function(value, index){
		var $target = $('[name="'+ value.Name +'"]');			
		$target.on("change", function() { 
			var option = getCurrentOption(index); 
			var optionString = _.map(option).join(".");	
			
			// Gets the first variant option based on the current selected option
			// input[string]: current selected option ex: A1 || A1 + B2 || A1 + B2 + C1
			// output[array]: First matching combination as array: [A1,B2,C1]
			option = _.chain(variants)
				.filter(function(obj){ return _.includes(obj.id, optionString); })	// filter: only variants containing the current option combination
				.take() // take firsts object in array
				.thru(function(array) {
					if(array.length == 0) 
					{
						// Error checking. Forces a value if invalid combination is entered 
						// Backup if options are not hidden properly	
						alert('ERROR: Combination does not exist. The options will be reseted.')							
						return firstVariant;
					}
				    return _.split(array[0].id, '.');  //transforms the id into an array ex: A1.B2.C1 -> [A1,B2,C1]
				 })
				.value();  // gets value of the chain				
			
			selectVariant(option);
			filterOptions(option);

		});	
	});

	// Init
	selectVariant(firstVariant);		
	filterOptions(firstVariant);

	// Functions
	function getSelects() {
		// Get the variant selects
		var selects = [];
		$("#variants select").each(function(){
			var select = {};
			select.Name = $(this).attr("name");
			select.Index = $(this).index();
			selects.push(select);
		});	
		return selects;
	}

	function selectVariant(variant) {		
		// Selects variant	
		_.map(selects, function(value, index){	
			var $target = $('[name="'+ value.Name +'"]');	
			$target.val(variant[index]);
		});
		$('[name="VariantID"]').val(_.map(variant).join("."));
	}

	function getCurrentOption(index) {
		// Gets the currently selected option based on select index
		// Maps the Selects array 
		// Ex: index 2 -> [A1.B1.C1] || index 1 -> [A1,B1] || index 0 -> [A1]
		var value = _.reduce(selects, function(result, value, key){
			var selectIndex = value.Index;
			var selectValue = $('[name="'+ value.Name +'"]').val();

			if (selectIndex <= index) {
				result.push(selectValue);				
			} 
			
			return result;

			},[]);		
		return value;
	}

	function filterOptions(option) {
		// option: ex: [A1] || [A1,B2] || [A1,B2,...]
		// index: index of the current select
		// result: options available for the next variant select ex: [C1,C2,C4]

		// resets all option to hidden before filtering
		_.map(selects, function(value, index){ 
			var $target = $('[name="'+ value.Name +'"]');		
			if(index != 0) {
				$target.find("option").trigger("hide");
			}	
		});
		
		// filters the selects based on the current option
		for (var i = 0; i < option.length - 1; i++) {
			var value = _.reduce(option, function(result, value, key){				
				if(key <= i) {
					result.push(value);
				}	
				return result
			}, []).join('.');
			filterNextSelect(value, i);
		}
	}

	function filterNextSelect(value, indexCurrentSelect) {
		var filteredNextSelect = _.chain(variants)
			.filter(function(obj){ return _.includes(obj.id, value); })	// filter: only variants containing the current option combination	
			.map(function(obj){  // filter: returns only values that are needed for the next select based on index of the select ex: [C1, C1, C3, C4]
					var value = _.split(obj.id, '.')[indexCurrentSelect+1];
					return value;
			})
			.uniq()  // removes redundancy ex: [C1,C3,C4]
			.value();  // gets value of the chain	

		_.map(filteredNextSelect, function(value, index){  // show options that are available			
			$('[name="'+ selects[indexCurrentSelect+1].Name +'"]').find("option").each(function(){					
				var optionValue = $(this).attr("value");
				if(optionValue == value) {
					$(this).trigger("show");
				}
			});

		});
	}

};


$(function(){	
	HandleVariants(variants);
});