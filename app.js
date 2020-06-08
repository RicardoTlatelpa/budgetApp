var budgetController = (function() {

})();

var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        descriptionType: '.add__description',
        valueType: '.add__value',
        buttonSelector: '.add__btn'
    }
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.descriptionType).value,
                value: document.querySelector(DOMstrings.valueType).value,                
            }            
        },
        getDOMStrings: function(){
            return DOMstrings;
        }
    }
})();


var controller = (function() {
    var DOM = UIController.getDOMStrings();
    var ctrlAddItem = function() {
        //1.Get the field input data
        var input = UIController.getinput()
        console.log(input);
        //2. Add the item to the budget controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    }
    document.querySelector(DOM.buttonSelector).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e){
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);

