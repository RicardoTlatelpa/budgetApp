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
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].map(object => {            
                sum += object.value;            
        })
       
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        calculateBudget: function() {
            //calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget: income - expenses 
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
            
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }

    }

})();

var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        descriptionType: '.add__description',
        valueType: '.add__value',
        buttonSelector: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        totalInc: '.budget__income--value',
        totalExp: '.budget__expenses--value',
        expensesPercentage: '.budget__expenses--percentage'
    }
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.descriptionType).value,
                value: parseFloat(document.querySelector(DOMstrings.valueType).value),                
            }            
        },        
        addListItem: function(obj, type){
            var html, element;

            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html =`<div class="item clearfix" id="income-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${obj.value}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            }
            
            document.querySelector(element)
            .insertAdjacentHTML('beforeend', html);

        },
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.descriptionType + ', ' +  DOMstrings.valueType);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(element => {
                element.value = '';
            });
            fieldsArr[0].focus();
        },  
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMstrings.totalInc).textContent = obj.totalInc;
            document.querySelector(DOMstrings.totalExp).textContent = obj.totalExp;
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.expensesPercentage).textContent = obj.percentage;
            }else {
                document.querySelector(DOMstrings.expensesPercentage).textContent = '---';
            }
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
    var updateBudget = function() {

        //1. Calculate the budget
        budgetController.calculateBudget();
        //2. Return the budget 
        var budget = budgetController.getBudget();
        //3. Display the budget on the UI
        
        UIController.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        let error = new Error('Please Enter a valid value!');
        //1.Get the field input data
        input = UIController.getinput()
        if(input.description.length < 1 || isNaN(input.value) || input.value === 0 ) {            
            return error;
        }
        
        //2. Add the item to the budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI
        UIController.addListItem(newItem, input.type);
        UIController.clearFields();
        //4. Calculate the budget
         updateBudget();
        

        //5. Display the budget on the UI
    }

    return {
        init: function() {
            setupEventListeners();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
        }
    }
})(budgetController, UIController);

controller.init();