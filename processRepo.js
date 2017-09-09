var exec = require('./executeCommand.js').exec;
var fs= require('fs');
var async= require('async');

var processRepo= function(repo, source, target, finalCallback){
    //TODO: add the bang
    if(fs.existsSync("D:\\git_clones\\Releases_ARD")){
        console.log("No Releases_ARD found. Please create the clones first in D:\\git_clones\\Releases_ARD.");
        process.exit(1);
    }

    var buildCherryCommand= function(source,target){
        var cmd= [];
        cmd.push("git cherry -v "+source+" "+target);
        cmd.push("grep -i -v 'update dependencies'");
        cmd.push("awk '!/CR 9446666/'");
        cmd.push(buildJSON());
        return cmd.join(" | ");
    };
    
    var buildJSON= function(){
        var json=[];
        json.push('awk \'BEGIN {print "["}');
        json.push('{if($1=="+"){print');
        json.push( '\"{\" \" commit :\" \"\\"\" $2 \"\\"\" \",comment:\" \"\\"\" substr($0,index($0,$3)) \"\\"\" \"},\" ');
        json.push('}}')
        json.push('END {print "]"}\'');
        return json.join(" ");
    };

    var createCommand= function(cmd, dump, save){
        return function(callback){
            var cmdOut= exec(cmd, repo, dump);
            if(cmdOut===-1){
                callback(new Error("git command failed"));
            }
            if(save){
                finalCallback(cmdOut,repo);
            }
            callback(null, cmdOut);
        };
    }
    async.series([
        createCommand("git pull", false, false),
        createCommand(buildCherryCommand(source, target), true, true)
    ],function(err,results){
        if(err){
            console.log("Some error occured while executing git commands in repo: "+repo);
            process.exit(1);
        }
    });
};

exports.processRepo = processRepo;