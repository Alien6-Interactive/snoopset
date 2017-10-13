var client = {
    host: HOST_URL
};

module.exports = function(){
    return new Promise(function(resolve){
        
        (function tryConnect(){
            client.ping(
                {
                  requestTimeout: 2000
                }
                , function(err) {
                if(err) {
                    tryConnect();
                }
                else {
                    console.log("Connected to the service url");
                    resolve(client);
                }
            });
        })();
        
    });
};