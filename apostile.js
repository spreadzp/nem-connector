
    // Include the library
    var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
    // Create a common object holding key
    var common = nem.model.objects.get("common");
    common.privateKey = "f4c6b46f3ebef0c2d46b1fd1564e528b889900d35c56c155e344aa015d74950b";
    // Simulate the file content
    var content = '{"field": "text", "field1":5, "field2": true}';
    var fileContent = nem.crypto.js.enc.Utf8.parse(content);

    // Create the apostille 
    function create() {
        var apostille = nem.model.apostille.create(common, "Test.txt", fileContent, "Test Apostille", nem.model.apostille.hashing["SHA256"], false, "", true, nem.model.network.data.testnet.id);
        return nem.model.transactions.send(common, apostille.transaction, endpoint).then(function (res) {
            // If code >= 2, it's an error
            if (res.code >= 2) {
                console.error(res.message);
            } else {
                console.log("\nTransaction: " + res.message);
                console.log('Totalres :', res);
                console.log("\nCreate a file with the fileContent text and name it:\n" + apostille.data.file.name.replace(/\.[^/.]+$/, "") + " -- Apostille TX " + res.transactionHash.data + " -- Date DD/MM/YYYY" + "." + apostille.data.file.name.split('.').pop());
                console.log("When transaction is confirmed the file should audit successfully in Nano");
                console.log("\nYou can also take the following hash: " + res.transactionHash.data + " and put it into the audit.js example");
                txHash = res.transactionHash.data;
                connect(connector);
            }
        }, function (err) {
            console.error(err);
        });
    }
    // Serialize transfer transaction and announce



   
    // Simulate the file content
    var fileContent = nem.crypto.js.enc.Utf8.parse(content);

    // Transaction hash of the Apostille
    function audit(checkingHash) {
        // Get the Apostille transaction from the chain 
        return nem.com.requests.transaction.byHash(endpoint, checkingHash).then(function (res) {
            // Verify
            if (nem.model.apostille.verify(fileContent, res.transaction)) {
                console.log('Validres :', res);
                console.log("Apostille is valid");
                console.log('content in JSON :', JSON.parse(content));
            } else {
                console.log("Apostille is invalid");
            }
        }, function (err) {
            console.log("Apostille is invalid");
            console.log(err);
        });
    }

    var address = "TAFNHOF54VTOJY3OM3BTDWZHDL6NJEBEX4XAV2DW";

    // Create a connector object
    var endpointWs = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);
    var connector = nem.com.websockets.connector.create(endpointWs, address);

    // Set start date of the monitor
    var date = new Date();

    // Try to establish a connection


    // Connect using connector
    function connect(connector) {
        return connector.connect().then(function () {
            nem.com.websockets.subscribe.errors(connector, function (res) {
                // Set time
                console.log('res errors:', res);
            });

            // Subscribe to confirmed transactions channel
            nem.com.websockets.subscribe.account.transactions.confirmed(connector, function (res) {
                // Set time 

                console.log('+++res confirmed :', res.meta.hash.data);
                send(res.meta.hash.data);
                //audit(res.meta.hash.data);
            });

            // Request account data
            nem.com.websockets.requests.account.data(connector);

            // Request recent transactions
            nem.com.websockets.requests.account.transactions.recent(connector);

        }, function (err) {
            // Set time
            console.log('err :', err);
            // Try to reconnect
            reconnect();
        });
    }

    function reconnect() {
        // Replace endpoint object
        endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.testnet[1].uri, nem.model.nodes.websocketPort);
        // Replace connector
        connector = nem.com.websockets.connector.create(endpoint, address);
        // Set time
        console.log('Trying to connect to: ' + endpoint.host);
        // Try to establish a connection
        connect(connector);
    }

    function send(hashMessage) {
        var transferTransaction = nem.model.objects.get("transferTransaction");
        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = 10;

        // Recipient address must be clean (no hypens: "-")
        transferTransaction.recipient = "TD75D6U43FMCRV4I4V3PSMEZHJEBI7VK5TFULAHG";

        // Set message
        transferTransaction.message = hashMessage;

        // Prepare the updated transfer transaction object
        var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

        // Serialize transfer transaction and announce
        nem.model.transactions.send(common, transactionEntity, endpoint).then(function (res) {
            // If code >= 2, it's an error
            if (res.code >= 2) {
                alert(res.message);
            } else {
                alert(res.message);
            }
        }, function (err) {
            alert(err);
        });
    } 
    create()