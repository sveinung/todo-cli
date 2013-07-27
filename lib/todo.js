var program = require('commander');
var fs = require('fs');
var _ = require('underscore');

var defaultTodoFile = './todo.txt';

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "taskDescription": taskDescription,
        "completed": false
    };
};

var saveTasks = function(filePath, tasks) {
    var content = JSON.stringify(tasks, null, 4);
    fs.writeFileSync(filePath, content);
};

var todo = function(arguments) {
    program
        .version('0.0.1')
        .option('-f, --file <file>', 'path to task file. defaults to ' + defaultTodoFile);

    program
        .command('new [task]')
        .description('creates a new task')
        .action(function(env) {
            var taskDescription = env;
            var todoFile = program.file || defaultTodoFile;

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
