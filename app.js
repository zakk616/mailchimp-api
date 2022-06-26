// jshint esversion: 6
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var key = "ff71c427a6c2746cfc9e4af21b1cf306-us13";
var list_id = "5d4f60ab7a";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(`${firstName} ${lastName} ${email}`);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "zakk616:" + key,
  };

  var url = "https://us13.api.mailchimp.com/3.0/lists/" + list_id;

  const request = https.request(url, options, (response) => {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", (chunk) => {
    //     chunk = (JSON.parse(chunk));
    //     console.log(chunk.error);
    //     if (chunk.error) {
    //         res.sendFile(__dirname + "/success.html");
    //     }
    //     else {
    //         res.sendFile(__dirname + "/failure.html");
    //     }
    // });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

function run(port) {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
}

// app.listen(process.env.PORT, run(process.env.PORT));
app.listen(3000, run(3000));
