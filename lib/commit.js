'use strict';

var chalk = require('chalk');
var util  = require('util');

// Simple representation of a GitHub ref.
function Commit(user, repo, sha, branch) {
  if (!user || !repo || !sha || !branch) {
    throw new Error('Commit is missing values; got: ' + util.inspect(arguments));
  }
  this.user   = user;
  this.repo   = repo;
  this.sha    = sha;
  this.branch = branch;

  this.repoUrl  = 'https://github.com/' + user + '/' + repo;
  this.key      = user + '/' + repo + '/' + sha;
}

Commit.prototype.inspect = function() {
  return chalk.cyan(this.user + '/' + this.repo) + '@' + chalk.yellow(this.sha.substr(0, 8));
}

// https://developer.github.com/v3/activity/events/types/#pushevent
Commit.forPushEvent = function forPushEvent(event) {
  var branch = event.ref.match(/^refs\/heads\/(.+)$/)[1];
  var repo   = event.repository;
  return new Commit(repo.owner.name, repo.name, event.head_commit.id, branch);
};

// https://developer.github.com/v3/activity/events/types/#pullrequestevent
Commit.forPullRequestEvent = function forPullRequestEvent(event) {
  var head = event.pull_request.head;
  return new Commit(head.user.login, head.repo.name, head.sha, head.ref);
};

module.exports = Commit;