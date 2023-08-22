function displayTime(){
    
    let date=document.getElementById("time");
    
    function time(){
        let now=new Date();
        date.innerHTML=now;
    }
    time();
    setInterval(time,1000);

}
displayTime();

function FindInputCheck(){
    
    if(!(document.getElementById('Dog').checked||document.getElementById('Cat').checked)) {
        alert("Please select a desired Species");
        return false;
    }
    
    let breedText=document.getElementById("breedText").value;
    

    if(breedText.trim() === ''&&!document.getElementById('breedNA').checked) {
        alert("Please select a desired breed or select\"Doesn't matter\"");
        return false;
    }
    

    return true;
}

function GiveInputCheck(){
    
    if(!(document.getElementById('Dog').checked||document.getElementById('Cat').checked)) {
        alert("Please select the Species");
        return false;
    }
    
    let breedText=document.getElementById("breedText").value;
    let FirstName=document.getElementById("FirstName").value;
    let LastName=document.getElementById("LastName").value;
    
    

    if(breedText.trim() === ''&&!document.getElementById('breedMixed').checked) {
        alert("Please select a desired breed or select\"Mixed Breed\"");
        return false;
    }
    if(FirstName.trim() === '') {
        alert("Please enter your First Name");
        return false;
    }
    if(LastName.trim() === '') {
        alert("Please enter your Last Name");
        return false;
    }
    
    

    return true;
}
function CreateChecker(){
    
    
    let password=document.getElementById("password").value;
    let username=document.getElementById("username").value;
    
    
    

    
    if(!(/^[A-Za-z0-9]*$/.test(username))){
        alert("Username can only be lettters and digits");
        return false;
    }

    if(!(/^[A-Za-z0-9]*$/.test(password))){
        alert("Password can only be lettters and digits");
        return false;
    }
    if(!/\d/.test(password)||!/[a-zA-Z]/.test(password)){
        alert("Password must contain at least one letter and one digit");
        return false;
    }
    

    return true;
}