const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/malika-database(Project-1)?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology:true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))
//ask arpit sir----
app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});