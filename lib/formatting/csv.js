var moment = require('moment');
var _ = require('underscore');

var csv = function(task) {
    var dateFormat = 'YYYY-MM-DD HH:mm';
    var createdFormatted = moment(task.created).format(dateFormat);

    var taskFormatted = task.id + ',' + task.description +
        ',' + createdFormatted + ',';

    if (!_.isNull(task.completed)) {
        var completedFormatted = moment(task.comleted).format(dateFormat);
        taskFormatted += completedFormatted;
    }

    console.log(taskFormatted);
};

module.exports = csv;
