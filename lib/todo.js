var program = require('commander');
var fs = require('fs');
var _ = require('underscore');

var todoFile = './todo.txt';

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "taskDescription": taskDescription,
        "completed": false
    };
};

var saveTasks = function(filePath, tasks) {
    var content = JSON.stringify(tasks, null, 4);
    fs.writeFileSync(todoFile, content);
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
                var content = fs.readFileSync(todoFile);
                var tasks = JSON.parse(content);

                var size = _.size(tasks);

                var task = createTask(size + 1, taskDescription);

                tasks.push(task);

                saveTasks(todoFile, tasks);

            } else {
                var task = createTask(1, taskDescription);
                var tasks = [task];

                saveTasks(todoFile, tasks);
            }
        });

    program.parse(arguments);
};

module.exports = todo;
