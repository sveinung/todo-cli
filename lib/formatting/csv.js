var moment = require('moment');
var _ = require('underscore');

var csv = function(task) {
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

    console.log(taskFormatted);
};

module.exports = csv;
