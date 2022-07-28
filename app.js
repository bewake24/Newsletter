const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")) //Helps to load stylesheet or static files in our system to the server.

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
  //console.log("Get working")
});

app.post("/", function(req, res){
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us9.api.mailchimp.com/3.0/lists/7d6907cf1a";
  const options = {
    method: "POST",
    auth: "vivek1:1d30ae0c81b8df50f6b713d13cbadf4d-us9"
  }
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      //console.log(JSON.parse(data));
    })
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

// Checking whether server is working or not.
app.listen(process.env.PORT || 3000, function(){ //At the actual server there can be any location for porting not necesarily 3000 "so process.env.PORT" provides independency fron porting location i.e dynamic PORT. 
  console.log("Server is running on port 3000.");
});

// Mailchimp APi: 1d30ae0c81b8df50f6b713d13cbadf4d-us9
// Audience/List ID: 7d6907cf1a
