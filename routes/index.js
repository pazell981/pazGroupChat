module.exports = function Route(app){
  app.get('/', function(req, res){
    res.render('index', {title:'Group Chat 2.0'});
  });
  users = {}
  app.io.on('connection', function (req) {
  	console.log('New User Connected', req.id);
  });
  app.io.route('user_connect', function(req){
    req.io.emit('user_added', { name: req.data.name, user_id: req.socket.id, users_connected: users});
    req.io.broadcast('new_user_added', { name: req.data.name, user_id: req.socket.id});
    users[req.socket.id] = {user_id: req.socket.id, name: req.data.name};  //this way we can reference the user in the users object by their req.id;
  });
  app.io.route('message', function (req){
    app.io.broadcast('message', { user_name: req.data.name, user_message: req.data.message})
  });
 	app.io.route('disconnect', function (req){
 		console.log('User disconnected', req.socket.id);
    delete users[req.socket.id];
 		req.io.broadcast('user_disconnect', { user_id: req.socket.id});
 	});
 //you will add more routes and logic here but this is how to write the default route for your project
}