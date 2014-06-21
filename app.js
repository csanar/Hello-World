var app = new Object();

var flickeringFire = "flickering-fire-6483";
var cns = "cns";
var fromDate = new Date("6/21/14 13:17:00");
var setSize = 5;


$(document).ready(function(){
	app.initializeApp();
	app.activateApp();
});

app.initializeApp = function () {
	app.Name = flickeringFire;
	app.dataRef = new Firebase('https://' + this.Name + '.firebaseio.com/');

	var appDateLimit = app.dataRef.startAt(fromDate.getTime());
	var appDataLimit = app.dataRef.limit(setSize);
	app.dataQuery = appDataLimit;
};

app.activateApp = function () {
	$('#messageInput').keypress(function (e) {
		if (e.keyCode == 13) {
		  var name = $('#nameInput').val();
		  var text = $('#messageInput').val();
		  

		  app.dataRef.push().setWithPriority({name: name, text: text}, new Date().getTime());

		  $('#messageInput').val('');
		}
	});
	app.dataQuery.on('child_added', function(snapshot) {
		var message = snapshot.val();
		var id = snapshot.name();
		displayChatMessage(id, message.name, message.text);
	});
	app.dataQuery.on('child_removed', function(snapshot) {
		var message = snapshot.val();
		var id = snapshot.name();
		$("#"+id).remove();
		//$("#messagesDiv").find("div:contains("+ message.name +"):contains("+ message.text +")").remove();
	});
	app.dataQuery.on('child_changed', function(snapshot){
		var message = snapshot.val();
		var id = snapshot.name();
		console.log(id);
		var newHTML = getMessageHTML(id, message.name, message.text).html();

		$("#"+id).replaceWith(newHTML);
		//$("#messagesDiv").find("div:contains("+ message.name +"):contains("+ message.text +")").replaceWith(newHTML);

	});
	function displayChatMessage(id, name, text) {
		getMessageHTML(id, name, text).appendTo($('#messagesDiv'));
		$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
	};
	function getMessageHTML(id, name, text) {
		return $('<div/>').attr('id', id).text(text).prepend($('<em/>').text(name+': '));
	}
};
