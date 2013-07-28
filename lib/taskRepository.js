var fs = require('fs');
var _ = require('underscore');

function TaskRepository(filePath, config) {
    this.filePath = filePath || config.defaultTodoFile;
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

module.exports = TaskRepository;
