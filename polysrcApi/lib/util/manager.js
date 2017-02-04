"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.jobQ = [];
    this.jobIndex = {};
    this.currentJob = null;
  }

  _createClass(Manager, [{
    key: "createJob",
    value: function createJob(jobName, fn) {
      var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (jobIndex[jobName] !== undefined) throw "job type already exists";
      if (interval === null) throw "no job interval specified";else {
        var job = new Job(jobName, fn, interval, this.jobQ.length);
        this.jobIndex[jobName] = job;
        return job;
      }
    }
  }, {
    key: "removeJob",
    value: function removeJob(jobName) {
      if (jobIndex[jobIndex] === undefined) throw "no job of type " + jobName;else delete jobIndex[jobIndex];
    }
  }, {
    key: "start",
    value: function start(jobName) {
      var job = this.jobIndex[jobName];
      if (job === undefined) throw "no job of type " + jobName;
      var readyJob = null;
      if (job.interval > 0) {
        return setInterval(job.fn, job.interval * 1000);
      } else {
        return job.fn;
      }
    }
  }, {
    key: "clear",
    value: function clear(id) {
      clearInterval(id);
    }
  }]);

  return Manager;
}();

exports.default = Manager;

var Job = function Job(name, fn, interval, id) {
  _classCallCheck(this, Job);

  this.name = name;
  this.fn = fn;
  this.interval = interval;
  this.id = id;
};