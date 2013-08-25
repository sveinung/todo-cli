var program = require('commander');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var TaskRepository = require('./taskRepository');
var config = require('./config');

var pretty = require('./formatting/pretty');
var csv = require('./formatting/csv');
var table = require('./formatting/table');

var createTask = function(id, taskDescription) {
    return {
        "id": id,
        "description": taskDescription,
        "completed": null,
        "created": moment()
    };
};

var outputFormats = {
    pretty: pretty,
    csv: csv,
    table: table
};

var todo = function(arguments) {
    program
        .version('0.0.1')
        .option('-f, --file <file>', 'path to task file. defaults to ' + config.defaultTodoFile)
        .addImplicitHelpCommand();

    program
        .command('new [task]')
        .description('creates a new task')
        .action(function(env) {
            var taskDescription = env;

            if (_.isUndefined(taskDescription)) {
                console.error('The task description must be provided');
                process.exit(1);
            }

            var taskRepository = new TaskRepository(program.file, config);

            if (taskRepository.exists()) {
                var tasks = taskRepository.getTasks();

                var size = _.size(tasks);

                var task = createTask(size + 1, taskDescription);

                tasks.push(task);

                taskRepository.saveTasks(tasks);

            } else {
                var task = createTask(1, taskDescription);
                var tasks = [task];

                taskRepository.saveTasks(tasks);
            }
        });

    program
        .command('list')
        .description('list tasks')
        .option('--format <format>', 'Format of the output')
        .action(function(command) {
            var format = (command.format || 'pretty');

            var taskRepository = new TaskRepository(program.file, config);

            if (taskRepository.exists()) {
                var tasks = taskRepository.getTasks();

                var formatter = outputFormats[format];
                if (formatter) {
                    formatter(tasks);
                } else {
                    console.error('No such formatter');
                }

            } else {
                console.error(taskRepository.filePath, 'does not exist');
            }
        });

    program
        .command('done [task]')
        .description('complete a task')
        .action(function(env) {
            var taskNumber = env;

            if (_.isUndefined(taskNumber)) {
                console.error('The task number must be provided');
                process.exit(1);
            }

            var taskRepository = new TaskRepository(program.file, config);

            if (taskRepository.exists()) {
                var tasks = taskRepository.getTasks();
                var task = _.find(tasks, function(task) {
                    return taskNumber == task.id;
                });
                if (_.isUndefined(task)) {
                    console.error('Task ' + taskNumber + ' does not exist');
                    process.exit(1);
                }

                task.completed = moment();

                taskRepository.saveTasks(tasks);

                console.log('Task ' + taskNumber + ' completed');

            } else {
                console.error(taskRepository.filePath, 'does not exist');
            }
        });

    program.parse(arguments);
};

module.exports = todo;
