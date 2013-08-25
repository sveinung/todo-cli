var moment = require('moment');
var _ = require('underscore');

require('colors');

var pretty = function(tasks) {
    _.each(tasks, function(task) {
        var dateFormat = 'YYYY-MM-DD HH:mm';
        var createdFormatted = moment(task.created).format(dateFormat);

        var taskFormatted =
            task.id + ' - ' + task.description.bold + '\n' +
            '    Created:   ' + createdFormatted;

        if (!_.isNull(task.completed)) {
            var completedFormatted = moment(task.completed).format(dateFormat);
            taskFormatted += '\n    Completed: ' + completedFormatted;
            taskFormatted = taskFormatted.green;
        }

        console.log(taskFormatted);
    });
};

module.exports = pretty;
