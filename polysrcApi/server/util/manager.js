export default class Manager {

  constructor(){
    this.jobQ = [];
    this.jobIndex = {};
    this.currentJob = null;
  }

  createJob(jobName, fn, interval = null){
    if(jobIndex[jobName] !== undefined) throw "job type already exists";
    if(interval === null) throw "no job interval specified";
    else {
      let job = new Job(jobName, fn, interval, this.jobQ.length);
      this.jobIndex[jobName] = job;
      return job;
    }
  }

  removeJob(jobName){
    if(jobIndex[jobIndex] === undefined) throw `no job of type ${jobName}`;
    else delete jobIndex[jobIndex];
  }

  start(jobName){
    let job = this.jobIndex[jobName];
    if(job === undefined) throw `no job of type ${jobName}`;
    let readyJob = null;
    if(job.interval > 0){
      return setInterval(job.fn, job.interval*1000);
    } else {
      return job.fn;
    }
  }

  clear(id) {
    clearInterval(id);
  }
}

class Job {
  constructor(name, fn, interval, id){
    this.name = name;
    this.fn = fn;
    this.interval = interval;
    this.id = id;
  }
}
