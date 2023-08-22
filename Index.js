const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port=5096
const fs = require('fs');
const path=require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "fldasknladfsn",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'HomeFinder')));
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'HomeFinder', 'Home.html'));
  res.cookie("LoggedIn",false);
});

app.post('/submit-find', (req,res)=>{
  console.log("1")
    const Species=req.body.Species;
    const Breed=req.body.breedText;
    const Age=req.body.Age;
    const Gender=req.body.Gender;
    let Personality=[];

    if(req.body.AlongDogs){
        Personality.push("Gets along with other dogs");
    }
    if(req.body.AlongCats){
        Personality.push("Gets along with other cats");
    }
    if(req.body.AlongChildren){
        Personality.push("Gets along with small children");
    }
    
    let Output="";
    fs.readFile('AvailablePetInformation.txt', 'utf8', (err, data) => {
      console.log("2");
      if (err){
        console.error(err);
      }
      const lines = data.split('\n');
      for(let k=0;k<lines.length;k++){
        let PetWorks=true;
        const characteristics=lines[k].split("#")//elements will be seperated by #
        for(let i=0;i<characteristics.length;i++){
          if(i===0){
            if(!(Species===characteristics[i])){
              PetWorks=false;
              break;
            }
          }
          if(i===1){
            if(!Breed||Breed.trim()===""){
              continue;
            }
            if(!(Breed.trim()===characteristics[i])){
              PetWorks=false;
              break;
            }
            
          }
          if(i===2){
            if(!(Age===characteristics[i])){
              PetWorks=false;
              break;
            }
          }
          if(i===3){
            if(!(Gender===characteristics[i])){
              PetWorks=false;
              break;
            }
          }
          for(let j=0;j<Personality.length;j++){
            if(characteristics[i].includes(Personality[j])){
              PetWorks=false;
              break;
            }
          }
        }
        if(PetWorks){
          Output+=`${lines[k].replace(/#/g, ' ')}`;
          Output+="\n";
        }
        
        
      }
      if (Output===""){
        Output="None";
      }
      console.log("3");
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Find a dog/cat</title>
          <link rel="stylesheet" type="text/css" href="Style.css">
          <script src="Project.js"></script>
      </head>
      <body onload="displayTime()">
          <div id="header">HomeFinder
              <a href="Home.html"><img src="logo.png" alt="Logo"></a>
              <div id="time" onload="displayTime()"></div>
          </div>
          <div class="container">
          <div id="content-area">
          <p>
          <b>Matching pets:</b><br><br>
          ${Output}
          </p>    
          </div>
              <aside class="sidemenu"><ul>
              <li><a href="Home.html">Home</a></li>
              <li><a class="active" href="Find.html">Find a dog/cat</a></li>
              <li><a href="DogCare.html">Dog Care</a></li>
              <li><a href="CatCare.html">Cat Care</a></li>
              <li><a href="/give">Have a pet to give away</a></li>
              <li><a href="Contact.html">Contact Us</a></li>
              <li><a href="/logout">Logout</a></li>
          </ul></aside>
          
      </div>
         
          <div id="footer"><a href="Privacy.html">Privacy\Disclaimer Statement</a></div>
      </body>
      </html>`);
    });

});
app.post('/submit-create', (req,res)=>{
  const username=req.body.username;
  const password=req.body.password;//Passwords should definitely be hashed but this is not part of this assignment

  fs.readFile('login.txt', 'utf8', (err, data) =>{
    const lines = data.split('\n');

    let AlreadyExists=false;

    for(let i=0;i<lines.length;i++){
      const Username=lines[i].split(":");//: seperates username and password
      if(username===Username[0]){ 
        res.send("<script>alert(\"Username already exists\"); window.location.href = \"/Create.html\"; </script>");
        AlreadyExists=true;
        break;
      }
    }
    if(!AlreadyExists){
      fs.appendFile("login.txt", "\n"+username + ":" + password, (err) => {
        if (err) {
            console.error("An error occurred:", err);
        } else {
            console.log("Data has been appended to the file.");
        }
    });//Passwords should definitely be hashed but this is not part of this assignment
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Find a dog/cat</title>
          <link rel="stylesheet" type="text/css" href="Style.css">
          <script src="Project.js"></script>
      </head>
      <body onload="displayTime()">
          <div id="header">HomeFinder
              <a href="Home.html"><img src="logo.png" alt="Logo"></a>
              <div id="time" onload="displayTime()"></div>
          </div>
          <div class="container">
          <div id="content-area">
              <b>Success!</b></div>
              <aside class="sidemenu"><ul>
              <li><a href="Home.html">Home</a></li>
              <li><a href="Find.html">Find a dog/cat</a></li>
              <li><a href="DogCare.html">Dog Care</a></li>
              <li><a href="CatCare.html">Cat Care</a></li>
              <li><a class="active" href="Create.html">Create an account</a></li>
              <li><a href="/give.html">Have a pet to give away</a></li>
              <li><a href="Contact.html">Contact Us</a></li>
              <li><a href="/logout">Logout</a></li>
          </ul></aside>
          
      </div>
         
          <div id="footer"><a href="Privacy.html">Privacy\\Disclaimer Statement</a></div>
      </body>
      </html>`);
    }
  });
});

app.get('/give',(req,res)=>{
let session=req.session;
if(session.username){
  res.sendFile(path.join(__dirname,'HomeFinder','Give.html'));
}
else{
  res.sendFile(path.join(__dirname,'HomeFinder','Login.html'));
}
});

app.post('/login-check',(req,res)=>{
const password=req.body.password;
const username=req.body.username;
console.log(username);
console.log(password);console.log("  ")
fs.readFile('login.txt', 'utf8', (err, data) =>{

  if(err){
    console.error(err);
  }
  const lines = data.split('\n');
  

  let Valid=false;

  for(let i=0;i<lines.length;i++){
    const Username=lines[i].split(":");//: seperates username and password

    if(username.trim()===Username[0].trim()&&password.trim()===Username[1].trim()){ 
      
      req.session.username=username;
      res.sendFile(path.join(__dirname,'HomeFinder','Give.html'));
      Valid=true;

      break;
    }
  }
  if(!Valid){
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" type="text/css" href="Style.css">
        <script src="Project.js"></script>
    </head>
    <body onload="displayTime()">
        <div id="header">HomeFinder
            <a href="Home.html"><img src="logo.png" alt="Logo"></a>
            <div id="time" onload="displayTime()"></div>
        </div>
        <div class="container">
        <div id="content-area"><form onsubmit="return CreateChecker()" action="/login-check"method="POST">
            <legend>Log in</legend><br>
            <label for="username">Username:</label>
            <input type="text" placeholder="Enter your username" name="username" id="username"><br><br>
            <label for="password">Password:</label>
            <input type="password" placeholder="Enter your password" name="password" id="password"><br><br>
            <input type="submit">
        </form>
    
        <p id="incorrect" style="color:red; font-weight: bold; ">Incorrect username or password</p>
        
        </div>
            <aside class="sidemenu"><ul>
            <li><a href="Home.html">Home</a></li>
            <li><a href="Find.html">Find a dog/cat</a></li>
            <li><a  href="DogCare.html">Dog Care</a></li>
            <li><a  href="CatCare.html">Cat Care</a></li>
            <li><a href="Create.html">Create an account</a></li>
            <li><a class="active" href="/give">Have a pet to give away</a></li>
            <li><a href="Contact.html">Contact Us</a></li>
            <li><a href="/logout">Logout</a></li>
        </ul></aside>
        
    </div>
       
        <div id="footer"><a href="Privacy.html">Privacy\\Disclaimer Statement</a></div>
    </body>`)
  }
  
      
  });

});

app.post('/submit-give',(req,res)=>{
  const Species=req.body.Species;
  const Breed=req.body.breedText;
  const Age=req.body.Age;
  const Gender=req.body.Gender;
  let Personality=[];
  if(req.body.AlongDogs){
    Personality.push("Gets along with other dogs");
  }
  if(req.body.AlongCats){
    Personality.push("Gets along with other cats");
  }
  if(req.body.AlongChildren){
    Personality.push("Gets along with small children");
  }
  let appendable=Species+"#"+Breed+"#"+Age+"#"+Gender;
  for(let i=0;i<Personality.length;i++){
    appendable+="#"+Personality[i];
  }
  fs.appendFile("AvailablePetInformation.txt", appendable,(err)=>{
    if(err){
      console.error(err);
    }
    else{
      console.log("Pet information added")
    }

  });
  res.sendFile(path.join(__dirname,'HomeFinder','Submitted.html'));
});

app.get('/logout',(req,res)=>{
  let session=req.session;
  if(session.username){
    session.destroy();
    res.sendFile(path.join(__dirname,'HomeFinder','Logout.html'));
  }
  else{
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dog Care</title>
        <link rel="stylesheet" type="text/css" href="Style.css">
        <script src="Project.js"></script>
    </head>
    <body onload="displayTime()">
        <div id="header">HomeFinder
            <a href="Home.html"><img src="logo.png" alt="Logo"></a>
            <div id="time" onload="displayTime()"></div>
        </div>
        <div class="container">
        <div id="content-area">
        
        <h3 style="color:red">You are not logged in.</h3></div>
            <aside class="sidemenu"><ul>
            <li><a href="Home.html">Home</a></li>
            <li><a href="Find.html">Find a dog/cat</a></li>
            <li><a  href="DogCare.html">Dog Care</a></li>
            <li><a  href="CatCare.html">Cat Care</a></li>
            <li><a href="Create.html">Create an account</a></li>
            <li><a href="/give">Have a pet to give away</a></li>
            <li><a  href="Contact.html">Contact Us</a></li>
            <li><a class="active" href="/logout">Logout</a></li>
        </ul></aside>
        
    </div>
       
        <div id="footer"><a  href="Privacy.html">Privacy\Disclaimer Statement</a></div>
    </body>`)
  }
  });

app.listen(port, () =>
  console.log(`HomeFinder listening on port ${port}!`),
);