var program = require('commander');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var defaultTodoFile = './todo.json';

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "description": taskDescription,
        "completed": null,
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
                    var dateFormat = 'YYYY-MM-DD HH:mm';
                    var createdFormatted = moment(task.created).format(dateFormat);

                    console.log(task.id + ' - ' + task.description);
                    console.log('    Created:   ' + createdFormatted);

                    if (!_.isNull(task.completed)) {
                        var completedFormatted = moment(task.comleted).format(dateFormat);
                        console.log('    Completed: ' + completedFormatted);
                    }
                });

            } else {
                console.error(todoFile, 'does not exist');
            }
        });

    program
        .command('done [task number]')
        .description('complete a task')
        .action(function(env) {
            var taskNumber = env;
            var todoFile = program.file || defaultTodoFile;

            if (fs.existsSync(todoFile)) {
                var tasks = getTasks(todoFile);
                var task = _.find(tasks, function(task) {
                    return taskNumber == task.id;
                });

                task.completed = moment();

                saveTasks(todoFile, tasks);

                console.log('Task ' + taskNumber + ' completed');

            } else {
                console.error(todoFile, 'does not exist');
            }
        });

    program.parse(arguments);
};

module.exports = todo;
