var express 		 = require("express"),
		path 				 = require("path"),
		//favicon 		 = require('serve-favicon'),
		logger 			 = require('morgan'),
		cookieParser = require('cookie-parser'),
		bodyParser 	 = require('body-parser'),
		helmet       = require("helmet"),
		port 				 = process.env["PORT"] || 8080;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: "layout" });

// config
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable("x-powered-by");
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'","*.stripe.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "*.stripe.com"],
  imgSrc: ["*"],
  connectSrc: ["*"],
  fontSrc: ["fonts.google.com"],
  objectSrc: ["*"],
  mediaSrc: ["'self'", "youtube.com", "twitch.tv"],
  frameSrc: ["*"],
  sandbox: ["allow-forms", "allow-scripts"],
  reportUri: '/report-violation',
  reportOnly: false, // set to true if you only want to report errors 
  setAllHeaders: false, // set to true if you want to set all headers 
  disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy) 
  safari5: false // set to true if you want to force buggy CSP in Safari 5 
}));

// require custom modules
var routes = require("./modules/routes");
app.use(routes);
var store = require("./modules/store");
app.use(store);
var fileHandler = require("./modules/file-handler");
app.use(fileHandler);

app.listen(port)
console.log("listening on port " + port);