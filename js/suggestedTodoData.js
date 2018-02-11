// load up the suggested TODO item lists

function initializeTodoData(todos, rawTodos, level) {
    rawTodos.forEach(function (rawTodo) {
        var createTodo = {
            title:       rawTodo[1].slice(0), 
            completed:   false, 
            points:      rawTodo[0], 
            level:       level, 
            description: rawTodo[2].slice(0)
        };
        todos.push(createTodo);
    });
}

suggestedBeginnerTodos = [] // global
var beginnerRaw = [
    // points [0]
    // title  [1]
    // description [2]
    [ 2, 'update computers', 'keep your computers up to date ...' ], 
    [ 1, 'update phones and tablets', 'apply updates to phone OS and apps ...' ], 
];
initializeTodoData(suggestedBeginnerTodos, beginnerRaw, 'beginner');

suggestedIntermediateTodos = [] // global
var intermediateRaw = [
    // points [0]
    // title  [1]
    // description [2]
    [ 2, 'use a password manager', 'lock up ...' ], 
    [ 2, 'use a strong master password', 'the password used to ...' ], 
];
initializeTodoData(suggestedIntermediateTodos, intermediateRaw, 'intermediate');

suggestedAdvancedTodos = [] // global
var advancedRaw = [
    // points [0]
    // title  [1]
    // description [2]
    [ 3, 'use two-factor authentication (2FA)', '2FA provides ...' ], 
    [ 3, 'use full disk encryption', 'disk encryption protects ...' ], 
];
initializeTodoData(suggestedAdvancedTodos, advancedRaw, 'advanced');
