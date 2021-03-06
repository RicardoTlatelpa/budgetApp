var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else {
            this.percentage = -1;
        }        
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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
        deleteItem: function(type,id){
            var ids, index;
            //id = 3
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1) {
                data.allItems[type].splice(index,1);
            }
            
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
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            })
            return allPerc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            return data;
        }
    }
        
})();

var UIController = (function() {
    var nodeListForEach = function (list, callback){
        for(let i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };
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
        expensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
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
            html =`<div class="item clearfix" id="inc-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${this.formatNumber(obj.value,type)}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${this.formatNumber(obj.value, type)}</div>
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
        deleteListItem: function(selectorID){
            var el =document.getElementById(selectorID)
            el.parentNode.removeChild(el);
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
            var type;
            obj.budget > 0 ? type = "inc": type = "exp";
            document.querySelector(DOMstrings.budgetValue).textContent = this.formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.totalInc).textContent = this.formatNumber(obj.totalInc,type);
            document.querySelector(DOMstrings.totalExp).textContent = obj.totalExp;
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.expensesPercentage).textContent = obj.percentage;
            }else {
                document.querySelector(DOMstrings.expensesPercentage).textContent = '---';
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.itemPercentage);
            
            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }                
            })
        },
        formatNumber: function(num, type){
            var numsplit, int, dec,type;
            num = Math.abs(num);
            num = num.toFixed(2);
            numSplit = num.split('.');
            int = numSplit[0];
            if(int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3);
            }
            dec = numSplit[1];
            type === "exp" ? sign = '-' : sign = '+';
            return sign + ' ' + int + '.' + dec;

        },
        
        displayMonth: function(){
            var year, month, day, months;
            var now = new Date();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year;
        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.descriptionType+ ',' + 
                DOMstrings.valueType
            );

            nodeListForEach(fields, function(curr) {
                curr.classList.toggle('red-focus');
            })

            document.querySelector(DOMstrings.buttonSelector).classList.toggle('red');
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
            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
            
            document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
    }
    var updateBudget = function() {

        //1. Calculate the budget
        budgetController.calculateBudget();
        //2. Return the budget 
        var budget = budgetController.getBudget();
        //3. Display the budget on the UI
        
        UIController.displayBudget(budget);
    };
    var updatePercentages = function(){
        // Calculate percentages
        budgetController.calculatePercentages();
        var percentages = budgetController.getPercentages();
        // read percentages from the budget controller
        // update the UI with the new percentages
        UIController.displayPercentages(percentages);
    }
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
        
        updatePercentages();
        
    };
    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            //DELETE from data structure
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetController.deleteItem(type,ID);

            //DELETE from the UI
            UIController.deleteListItem(itemID);

            //UPDATE budget
            updateBudget();

            updatePercentages();
        }
    }

    return {
        init: function() {
            setupEventListeners();
            UIController.displayMonth();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            
        },
       test: function(){
           return budgetController.testing();
       }
    }
})(budgetController, UIController);

controller.init();