var moment = require('moment');
var _ = require('underscore');

require('colors');

var pretty = function(task) {
    var dateFormat = 'YYYY-MM-DD HH:mm';
    var createdFormatted = moment(task.created).format(dateFormat);

    console.log(task.id + ' - ' + task.description.bold);
    console.log('    Created:   ' + createdFormatted);

    if (!_.isNull(task.completed)) {
        var completedFormatted = moment(task.comleted).format(dateFormat);
        console.log('    Completed: ' + completedFormatted);
    }
};

module.exports = pretty;
