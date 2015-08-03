var mosca = require('mosca');

var pubsubsettings = {
	//using ascoltatore
	type: 'mongo',
	url: 'mongodb://localhost:27017/mqtt',
	pubsubCollection: 'ascoltatori',
	mongo: {}
};

var moscaSettings = {
	port: 1883,           //mosca (mqtt) port
	backend: pubsubsettings   //pubsubsettings is the object we created above

};

var server = new mosca.Server(moscaSettings);   //here we start mosca
server.on('ready', setup);  //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
	console.log('Mosca server is up and running')
}

// fired when a message is published
server.on('published', function(packet, client) {
	console.log('Published', packet);//, packet);
	if(packet.topic == 'test/mqtt') {
		var json = JSON.parse(packet.payload);
		console.log('json', json);
	}

	if(packet.topic ==='get/user')
	{
		var returnTopic = 'return/user';
		var jsonMessage = {
			event : 'get',
			state: {
				id: 123,
				name : 'john smith',
				email: 'j@smith.com'
			}
		}
		server.publish({topic: returnTopic, payload:jsonMessage}, function() {
			console.log('done!');
		});
	}
	//console.log('Client', client);
});
// fired when a client connects
server.on('clientConnected', function(client) {
	console.log('Client Connected:', client.id);
});

// fired when a client disconnects
server.on('clientDisconnected', function(client) {
	console.log('Client Disconnected:', client.id);
});

server.on('message', function(topic, message) {
	console.log('message ['+topic+']', message);

	if(topic ==='get/user')
	{
		var returnTopic = 'return/user';
		var jsonMessage = {
			event : 'get',
			state: {
				id: 123,
				name : 'john smith',
				email: 'j@smith.com'
			}
		};
		server.publish(returnTopic, JSON.stringify(jsonMessage));
	}
});