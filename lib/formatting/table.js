var moment = require('moment');
var _ = require('underscore');
var Table = require('cli-table');

var table = function(tasks) {
    var taskTable = new Table({
        head: ['id', 'description', 'created', 'completed']
    });

    _.each(tasks, function(task) {
        var dateFormat = 'YYYY-MM-DD HH:mm';
        var createdFormatted = moment(task.created).format(dateFormat);

        var completedFormatted = '';
        var completedFlag = 'INCOMPLETE';
        if (!_.isNull(task.completed)) {
            completedFormatted = moment(task.completed).format(dateFormat);
            completedFlag = 'DONE';
        }

        var taskFormatted = task.id + ',' + task.description + ',' + completedFlag +
            ',' + createdFormatted + ',' + completedFormatted;

        taskTable.push([task.id, task.description, createdFormatted, completedFormatted]);
    });

    console.log(taskTable.toString());
};

module.exports = table;
