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

function TaskRepository(filePath) {
    this.filePath = filePath || defaultTodoFile;
}

_.extend(TaskRepository.prototype, {
    saveTasks: function(tasks) {
        var content = JSON.stringify(tasks, null, 4);
        fs.writeFileSync(this.filePath, content);
    },
    getTasks: function() {
        var content = fs.readFileSync(this.filePath);
        var tasks = JSON.parse(content);
        return tasks;
    },
    exists: function() {
        return fs.existsSync(this.filePath);
    }
});

var todo = function(arguments) {
    program
        .version('0.0.1')
        .option('-f, --file <file>', 'path to task file. defaults to ' + defaultTodoFile);

    program
        .command('new [task]')
        .description('creates a new task')
        .action(function(env) {
            var taskDescription = env;
            var taskRepository = new TaskRepository(program.file);

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
        .action(function() {
            var taskRepository = new TaskRepository(program.file);

            if (taskRepository.exists()) {
                var tasks = taskRepository.getTasks();

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
                console.error(taskRepository.filePath, 'does not exist');
            }
        });

    program
        .command('done [task number]')
        .description('complete a task')
        .action(function(env) {
            var taskNumber = env;
            var taskRepository = new TaskRepository(program.file);

            if (taskRepository.exists()) {
                var tasks = taskRepository.getTasks();
                var task = _.find(tasks, function(task) {
                    return taskNumber == task.id;
                });

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
