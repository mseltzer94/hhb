var fs = require('fs');
try{
  var alerting = require('./alerts/alert.json');
  console.log("HHB already installed and ready. No changes made. Proceed to start!");
} catch (err) {
  fs.readFile('alerts/alert.default.json', 'utf8', function(err, contents) {
    if (err){
      console.log("Failed to file alert.json and alert.default.json. Please check for the file, redownload and try again");
      process.exit(0);
    }
    fs.writeFile('alerts/alert.json', contents, function(err){
      if (err){
        console.log("Failed to write alert.json. Please check folder permissions and try again")
        process.exit(0);
      }
    })
    console.log("Succesfully installed HHB!");
  });
}
