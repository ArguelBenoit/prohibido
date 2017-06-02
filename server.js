const express	=	require('express');
const	session	=	require('express-session');
const	bodyParser = require('body-parser');
const redis = require('redis');
const client = redis.createClient();
const validator = require('email-validator');
const sendmail = require('gmail-send');
const fs = require('fs');

const email = {
	user: fs.readFileSync('mail/.user', 'UTF-8'),
	pass: fs.readFileSync('mail/.pass', 'UTF-8')
};

////////////CONFSERVER//////////////////////////

var app	=	express();
app.listen(8080);

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(session({secret: ' ', saveUninitialized: true, resave: true}));
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

////////////////ROAD/////////////////////////

var sess = '';
app.get('/', (req, res) => {
  res.render('index.html');
});
app.get('/en', (req, res) => {
  res.render('en.html');
});
app.get('/login', (req, res) => {
	if (sess.user && sess.code)
		res.redirect('/admin');
	else
		res.render('login.html');
});
app.post('/temp', (req, res) => {
	sess = req.session;
	client.hgetall('session', (err, result) => {
		if (result.user == req.body.user && result.code == req.body.code) {
			sess.user = req.body.user;
			sess.code = req.body.code;
			res.end('done');
		} else
			res.end('false');
	});
});
app.get('/admin', (req, res) => {
	sess = req.session;
	if (sess.user && sess.code)
		res.render('admin.html');
	else
		res.redirect('/login');
});
app.get('/logout',(req, res) => {
	req.session.destroy( err => {
		if(err)
			console.log(err);
		else
			res.redirect('/login');
	});
});

//////////////////AJAXREQUEST//////////////

app.post('/registration', (req, res) => {
	let mail = req.body.mail;
	if (validator.validate(mail)) {
		client.lrange('mails', 0, -1, (err, result) => {
			if (result.indexOf(mail) == -1)
				client.lpush('mails', mail);
		});
		sendmail({
			user: email.user,
			pass: email.pass,
			to: req.body.mail,
			subject: 'Informations Prohibido',
			html: 'Chers Clients,<br/><br/>'+
						'Merci de l\'intêret porté a notre établissement ...<br/>'+
						'Nous vous dévoilons aujourd\'hui l\'adresse et le mot de passe du Prohibido. Bien evidemment toutes ces informations doivent rester confidentielles.<br/><br/>'+
						'ADRESSE : 2 Rue des Cordeliers 64100 BAYONNE<br/><br/>'+
						'MOT DE PASSE : 1919<br/><br/>'+
						'Cependant pour ne pas vous faciliter la tache, nous vous laissons le soin de trouver l\'endroit ou nous avons dissimulé le digicode qui vous permettra d\'ouvrir les portes de notre Bar.<br/><br/>'+
						'Alors Soyez discret et n\'oubliez pas, ̈"Speak easy"<br/><br/>'+
						'L\'équipe du PROHIBIDO<br/><br/>'+
						'--<br/><br/>'+
						'Dear clients,<br/><br/>'+
						'Thank you for the interest brought to our establishment ...<br/>'+
						'Today we reveal the address and password of Prohibido. Obviously all this information must remain confidential.<br/><br/>'+
						'ADDRESS: 2 Rue des Cordeliers 64100 BAYONNE<br/><br/>'+
						'PASSWORD: 1919<br/><br/>'+
						'However, in order not to facilitate the task, we leave you to find the place where we have concealed the digicode which will allow you to open the doors of our Bar.<br/><br/>'+
						'So be discreet and do not forget, ̈"Speak easy"<br/><br/>'+
						'Team PROHIBIDO'
		})();
		res.end('done');
	} else {
		res.end('false');
	}
});

app.post('/sendmail', (req, res) => {
	let mail = req.body;
	sendmail({
		user: email.user,
		pass: email.pass,
		to: email.user,
		subject: mail.objet,
		html: '<br/><b>Email : </b>' + mail.email +
					'<br/><b>Tel : </b>' + mail.tel +
					'<br/><b>Date : </b>' + mail.date +
					'<br/><b>Nombre : </b>' + mail.nombre +
					'<br/><b>Message :</b><br/>' + mail.message
	})();
	res.end('done');
});

app.post('/users', (req, res) => {
	client.lrange('mails', 0, -1, (err, result) => { res.end(JSON.stringify(result)); });
});
