var async= require('async');
var processRepo= require('./processRepo.js').processRepo;

var allRepos= ["delete"
    //"build","technical","documents","avail-pricing",
    //"pnr","checkout","miscellaneous","tasks-flows"
];

var repoProcessor= function(repo,source,target){
    var doProcessing= function(callback){
        processRepo(repo,source,target,processOutput);
        callback(null,repo);
    };
    return async.reflect(doProcessing);
};

var allRepoProcessors;
async.map(allRepos, function(repo,callback){
        callback(null, repoProcessor(repo,'branchA','branchB'));
    }, function(err, results) {
    // results is now an array of stats for each file
    allRepoProcessors= results;
});

var processOutput = function(json, repo){
    console.log("Final Result: "+json);
    process.exit(0);
}

async.parallel(allRepoProcessors,
    // optional callback
    function(err, results) {
        console.log(results);
    });