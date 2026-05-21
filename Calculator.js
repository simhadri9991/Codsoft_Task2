// Central Operational State Memory
const workflow = {
    displayValue: '0',
    storedOperand: null,
    isAwaitingNextInput: false,
    activeOperator: null,
};

const displayScreen = document.getElementById('display');

// Attaching Event Flow Instantly to Keys
document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        // Logical Routing Tree Based on Button Type
        if (button.classList.contains('math-key')) {
            processOperator(value);
        } else if (button.classList.contains('action-key')) {
            wipeMemory();
        } else if (value === '=') {
            evaluateTotal();
        } else if (value === '.') {
            appendDecimalPoint();
        } else {
            appendDigit(value);
        }

        refreshUI();
    });
});

function appendDigit(digit) {
    if (workflow.isAwaitingNextInput) {
        workflow.displayValue = digit;
        workflow.isAwaitingNextInput = false;
    } else {
        // Prevent leading zeros from expanding awkwardly
        workflow.displayValue = workflow.displayValue === '0' 
            ? digit 
            : workflow.displayValue + digit;
    }
}

function appendDecimalPoint() {
    if (workflow.isAwaitingNextInput) {
        workflow.displayValue = '0.';
        workflow.isAwaitingNextInput = false;
        return;
    }

    if (!workflow.displayValue.includes('.')) {
        workflow.displayValue += '.';
    }
}

function processOperator(nextOperator) {
    const currentInput = parseFloat(workflow.displayValue);

    if (workflow.activeOperator && workflow.isAwaitingNextInput) {
        workflow.activeOperator = nextOperator;
        return;
    }

    if (workflow.storedOperand === null) {
        workflow.storedOperand = currentInput;
    } else if (workflow.activeOperator) {
        const computation = executeMath(workflow.storedOperand, currentInput, workflow.activeOperator);
        
        workflow.displayValue = String(Number(computation.toFixed(7)));
        workflow.storedOperand = computation;
    }

    workflow.isAwaitingNextInput = true;
    workflow.activeOperator = nextOperator;
}

function executeMath(leftSide, rightSide, operator) {
    switch (operator) {
        case '+': return leftSide + rightSide;
        case '-': return leftSide - rightSide;
        case '*': return leftSide * rightSide;
        case '/': 
            return rightSide === 0 ? 'Error' : leftSide / rightSide;
        default: return rightSide;
    }
}

function evaluateTotal() {
    const currentInput = parseFloat(workflow.displayValue);

    if (workflow.activeOperator === null || workflow.isAwaitingNextInput) {
        return;
    }

    const output = executeMath(workflow.storedOperand, currentInput, workflow.activeOperator);
    
    workflow.displayValue = String(Number(output.toFixed(7)));
    workflow.storedOperand = null;
    workflow.activeOperator = null;
    workflow.isAwaitingNextInput = false;
}

function wipeMemory() {
    workflow.displayValue = '0';
    workflow.storedOperand = null;
    workflow.isAwaitingNextInput = false;
    workflow.activeOperator = null;
}

function refreshUI() {
    displayScreen.innerText = workflow.displayValue;
}