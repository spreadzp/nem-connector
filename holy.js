$(document).ready(function () {
    // Load nem-browser library
    var nem = require("nem-sdk").default;


    // Create an NIS endpoint object
    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
    // Create an NIS endpoint websocket
    var endpointWs = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.websocketPort);
    // Get an empty un-prepared transfer transaction object
    var transferTransaction = nem.model.objects.get("transferTransaction");

    // Get an empty common object to hold pass and key
    var common = nem.model.objects.get("common");

    /**
     * Build transaction from form data and send
     */
    function send() {

        // Set the private key in common object
        common.privateKey = "f4c6b46f3ebef0c2d46b1fd1564e528b889900d35c56c155e344aa015d74950b";

        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = 5;

        // Recipient address must be clean (no hypens: "-")
        transferTransaction.recipient = "TD75D6U43FMCRV4I4V3PSMEZHJEBI7VK5TFULAHG";

        // Set message
        transferTransaction.message = "send 5 xem to winner!";

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
    // Call send function when click on send button
    $("#send").click(function () {
        send();
    });

    // Address to subscribe
    var address = "TAFNHOF54VTOJY3OM3BTDWZHDL6NJEBEX4XAV2DW";

    // Create a connector object
    var connector = nem.com.websockets.connector.create(endpointWs, address);

    // Set start date of the monitor
    var date = new Date();

    // Try to establish a connection
    connect(connector);

    // Connect using connector
    function connect(connector) {
        return connector.connect().then(function () {
            // Set time
            date = new Date();
            nem.com.websockets.subscribe.errors(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#confirm').append('<p><b>' + date.toLocaleString() + ':</b> Received error</p>');
                // Show data
                $('#confirm').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(res) + '</pre>');
            });

            // Subscribe to confirmed transactions channel
            nem.com.websockets.subscribe.account.transactions.confirmed(connector, function (res) {
                // Set time
                date = new Date();
                // Show event
                $('#confirm').append('<p><b>' + date.toLocaleString() + ':</b> Received confirmed transaction</p>');
                // Show data
                $('#confirm').append('<p><b>' + 'winner' + ': <pre>' + JSON.stringify(res.transaction.recipient) + '</pre>');
                $('#confirm').append('<p><b>' + 'get prize' + ': <pre>' + JSON.stringify(res.transaction.amount) + '</pre>');
                $('#confirm').append('<p><b>' + 'Message' + ': <pre>' + JSON.stringify(res.transaction.message.payload) + '</pre>');
                $('#confirm').append('<p><b>' + 'Message' + ': <pre>' + base64Decode(res.transaction.message.payload) + '</pre>');

                console.log('res total :', res);
            });

            // Request account data
            nem.com.websockets.requests.account.data(connector);

            // Request recent transactions
            nem.com.websockets.requests.account.transactions.recent(connector);

        }, function (err) {
            // Set time
            date = new Date();
            // Show event
            $('#confirm').append('<p><b>' + date.toLocaleString() + ':</b> An error occured</p>');
            // Show data
            $('#confirm').append('<p><b>' + date.toLocaleString() + ': <pre>' + JSON.stringify(err) + '</pre>');
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
        date = new Date();
        // Show event
        $('#confirm').append('<p><b>' + date.toLocaleString() + ':</b> Trying to connect to: ' + endpoint.host + '</p>');
        // Try to establish a connection
        connect(connector);
    } 

    function base64Decode(str) {
        return str.match(/.{1,2}/g).map(function(v){
            return String.fromCharCode(parseInt(v, 16));
          }).join(''); 
    }
});
