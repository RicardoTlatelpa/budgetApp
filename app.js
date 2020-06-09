var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }else {
                ID = 0;
            }
            
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        }
    }

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
        addListItem: function(obj, type){
                    `   <div class="item clearfix" id="income-0">
                            <div class="item__description">Salary</div>
                            <div class="right clearfix">
                                <div class="item__value">+ 2,100.00</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
        },
        getDOMStrings: function(){
            return DOMstrings;
        }        
    }
})();


var controller = (function() {

    var setupEventListeners = function() {
            var DOM = UIController.getDOMStrings();
            document.querySelector(DOM.buttonSelector).addEventListener('click', ctrlAddItem);
            document.addEventListener('keypress', function(e){
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function() {
        var input, newItem;
        //1.Get the field input data
        input = UIController.getinput()
        console.log(input);
        //2. Add the item to the budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    }
    return {
        init: function() {
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();