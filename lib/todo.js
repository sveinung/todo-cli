var program = require('commander');
var fs = require('fs');

var todoFile = './todo.txt';

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "taskDescription": taskDescription,
        "completed": false
    };
};


var todo = function(arguments) {
    program
    .version('0.0.1');

    program
    .command('new [task]')
    .description('creates a new task')
    .action(function(env) {
        var taskDescription = env;

        if (fs.existsSync(todoFile)) {

        } else {
            var task = createTask(1, taskDescription);
            var tasks = {
                "tasks": [task]
            };
            var content = JSON.stringify(tasks, null, 4);
            fs.writeFileSync(todoFile, content);
        }
    });

    program.parse(arguments);
};

module.exports = todo;
