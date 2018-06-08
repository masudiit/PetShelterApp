# Pet Shelter App
This application is to display if a Pet should use an umbrella based on the weather at it’s location. It is built upon lightweight framework Express in node.js. This application is completely separate from the Pet Shelter Api. It can talk to Pet Shelter Api’s database using only JSON endpoints. For calling mechanism, generic RESTclient ( Request module in node) is used.


## Setup

      1. Clone or download the repo, then change to the directory
      2. First configure the PetShelterApi and start it.
      3. Configure api url in config/default.json
                   
                     {
                            "App" : {
                                  "Port" :"9000"
                               },
                            "ApiServer" :
                            {
                                  "Url" : "http://localhost:5000"    
                            },
                            "DarkSky": {
                                "ApiKey" : "52e.....d3c"
                            }
                          }       
                
      4. Install dependencies  $npm install
      5. Start the service $npm start
      
               
    



## Demonstration
#### Public API
**Live Demo:**
 [https://npetshelterapi.herokuapp.com/api/pets]( https://npetshelterapi.herokuapp.com/api/pets) <br/>
**Github:** 
[https://github.com/masudiit/PetShelterApi](https://github.com/masudiit/PetShelterApi) <br/>
#### Public App
**Live Demo:**
[https://npetshelterapp.herokuapp.com](https://npetshelterapp.herokuapp.com) <br/> 
**Github:** [https://github.com/masudiit/PetShelterApp/](https://github.com/masudiit/PetShelterApp/) <br/>


