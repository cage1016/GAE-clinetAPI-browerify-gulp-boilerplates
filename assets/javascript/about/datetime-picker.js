var $ = require('jquery');
require('moment');
require('eonasdan-bootstrap-datetimepicker');
require('bootstrap');

module.exports = {

    init: function () {
        this.addDatetimePickerHandler();
    },

    addDatetimePickerHandler: function () {
        $(function () {
            $('#datetimepicker2').datetimepicker({
                minuteStepping: 1,
                format: 'YYYY/MM/DD HH:mm',
                use24hours: true
            });
        });
    }
};