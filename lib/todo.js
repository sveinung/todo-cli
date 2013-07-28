var program = require('commander');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var defaultTodoFile = './todo.json';

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "description": taskDescription,
        "completed": false,
        "created": moment()
    };
};

var saveTasks = function(filePath, tasks) {
    var content = JSON.stringify(tasks, null, 4);
    fs.writeFileSync(filePath, content);
};

var getTasks = function(filePath) {
    var content = fs.readFileSync(filePath);
    var tasks = JSON.parse(content);
    return tasks;
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
                var tasks = getTasks(todoFile);

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

    program
        .command('list')
        .description('list tasks')
        .action(function() {
            var todoFile = program.file || defaultTodoFile;

            if (fs.existsSync(todoFile)) {
                var tasks = getTasks(todoFile);

                _.each(tasks, function(task) {
                    console.log(task.id + ' - ' + task.description);

                    var createdFormatted = moment(task.created).format('YYYY-MM-DD HH:mm');
                    console.log('    Created:   ' + createdFormatted);
                });

            } else {
                console.error(todoFile, 'does not exist');
            }
        });

    program.parse(arguments);
};

module.exports = todo;
