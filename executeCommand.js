var exec = require('child_process').execSync;

var execute = function(command, repo, dump){
    try{
        var child= exec(command,{
            //cwd:'/Users/ayushgera/Development/office/projects/delete/releases_ARD/'+repo
            cwd: '/Users/ayushgera/Development/office/history/delete'
        });
        if(dump){
            return child.toString();
        }
    }catch(e){
        console.log(e.status);
        console.log(e.message);
        console.log(e.stderr);
        return -1;
    }
}

exports.exec = execute;