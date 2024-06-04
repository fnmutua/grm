import mongoose from 'mongoose';
import Grievance from "./../models/grievance";
import Document from "./../models/grievance";
import axios from 'axios';
import fs from 'fs';

 
import {writeFile} from 'fs/promises'
 
 
const directoryPath = './uploads'


const state = {
  currentState: null,
};

const sessionState = {};

let grievances;
let grievances_response = "END No grievances found";

const genderList =["Male", "Female"]
const YesNoList =["Yes", "No"] 
  
// generate grievance
async function generateGrievanceReferenceNumber() {
    const currentYear = new Date().getFullYear();
  
    // Query MongoDB to find the last grievance number
    let lastGrievanceNumber = await Grievance.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).exec();

 

  
    let newGrievanceNumber;
  
 
  
    if (
      lastGrievanceNumber &&
      lastGrievanceNumber.code &&
      lastGrievanceNumber.code.split("-").length === 3
    ) {
      const lastYear = lastGrievanceNumber.code.split("-")[1];
      const lastCount = parseInt(lastGrievanceNumber.code.split("-")[2]);
  
      if (parseInt(lastYear) === currentYear) {
        // Increment the count if the year matches the current year
        const newCount = lastCount + 1;
        newGrievanceNumber = `GRM-${currentYear}-${pad(newCount, 3)}`;
      } else {
        // Start count from 001 if the year is different
        newGrievanceNumber = `GRM-${currentYear}-001`;
      }
    } else {
      // If no grievance numbers exist yet, start from 001 for the current year
      newGrievanceNumber = `GRM-${currentYear}-001`;
    }
  
    return newGrievanceNumber;
  }
  
  // Helper function to pad numbers with leading zeros
  function pad(number, length) {
    let str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
  
  async function sendSMS(sms_obj) {
    // Send OTP via Leopard (not implemented in this code snippet)
    const url = "https://quicksms.advantasms.com/api/services/sendotp/";
  
    let msg =
      "Dear " +
      sms_obj.name +
      ", your grievance has been registered. Your reference is : " +
      sms_obj.code + ". You can monitor the status of your report here -> https://grm.ags.co.ke/status/"+sms_obj.id;
      
  
      //http://localhost:3000/status/6652e0486b49fb5075942951
  
  
    const requestData = {
      apikey: "25979d894f97b2a8df210fe0c20d68c5",
      partnerID: "10322",
      shortcode: "AGS",
      message: msg,
      mobile: sms_obj.phone,
    };
  
    axios
      .post(url, requestData)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  

  // Pagination for county options 
const itemsPerPage = 5; // Number of counties to show per page
const nextPageIdentifier = 99; // Unique identifier for "Next"
const  backPageIdentifier = 0 //  Unique identifier for "Back"


 // Function to get a subset of counties based on the current page
let live_counties;
let counties = [];
let subcounties = [];
let wards =[];
let settlements =[];


const getAllCounties = async () => {
  console.log("Getting counties......");
  subcounties=[]
  //const res = await axios.post(server + "api/auth/county/all");
  const res = await County.find({});

  let live_counties = res;
 // console.log("live_counties", live_counties);

  live_counties.sort((a, b) => a.code - b.code);

  live_counties.forEach((county) => {
    //console.log("County Name:", county.name);
    let cnty = {};
    cnty.code = county.code;
    cnty.name = county.name;
    counties.push(cnty);
  });
};

 

async function getSubCounties(county_id) {
  try {
     // find all documents named john and at least 18
     wards=[]
    let live_subcounties = await Subcounty.find({ county_id: county_id}).exec();

    live_subcounties.sort((a, b) => a.code - b.code);
    live_subcounties.forEach((subcounty) => {
      console.log("SubCounty Name:", subcounty.name);
      let scnty = {};
      scnty.code = subcounty.code;
      scnty.name = subcounty.name;
      subcounties.push(scnty);
    });

    
  } catch (error) {
    console.error(error);
  }
}

 
async function getWards(subcounty) {
  try {
    settlements=[]
   // const response = await axios.post(server + "api/auth/ward", subcounty);
    let live_wards = await Ward.find({ subcounty_id: subcounty}).exec();
    live_wards.sort((a, b) => a.code - b.code);

   live_wards.forEach((ward) => {
      console.log("unit Name:", ward.name);
      let unit = {};
      unit.code = ward.code;
      unit.name = ward.name;
      wards.push(unit);
    });


  } catch (error) {
    console.error(error);
  }
}
 
async function getSettlements(ward) {
  try {
    let live_settlements = await Settlement.find({ ward_id: ward }).exec();

    if (live_settlements.length === 0) {
      console.log("No settlements found for the given ward.");
     // return [{code:0, name: "No settlements found for the given ward. "}];
      // settlements.push({code:0, name: "No settlements found for the given ward. "});

    } else {

      live_settlements.forEach((sett) => {
        console.log("sett Name:", sett.name);
        let unit = {};
        unit.code = sett.code;
        unit.name = sett.name;
        settlements.push(unit);
      });
    
    }
 

  //  return settlements;
  } catch (error) {
    console.error("Error fetching settlements:", error);
    throw error; // or handle the error appropriately
  }
}



 // Function to get a subset of counties based on the current page
 const getCountiesPage = (page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return counties.slice(start, end);
};


const generateCountyMessage = (page) => {
  const countiesPage = getCountiesPage(page);
  let message = "CON Select your county:\n";
  countiesPage.forEach((county) => {
    message += `${county.code}. ${county.name}\n`;
  });
  if (page > 1) {
    message += `${backPageIdentifier}. Back\n`;
  }
  if (page * itemsPerPage < counties.length) {
    message += `${nextPageIdentifier}. Next\n`;
  }
  return message;
};


// Helper function to generate subcounty message
async function generateSubcountyMessage(county_id) {
  console.log("county_id", county_id);
  await getSubCounties(county_id);
  let message = "CON Select your subcounty:\n";
  subcounties.forEach((subcounty) => {
    message += `${subcounty.code}. ${subcounty.name}\n`;
  });
  return message;
}

 

// Helper function to generate ward message
async function generateWardMessage(subcounty_id) {
  console.log("subcounty_id", subcounty_id);
  await getWards(subcounty_id);
  let message = "CON Select your Ward:\n";
  wards.forEach((ward) => {
    message += `${ward.code}. ${ward.name}\n`;
  });
  return message;
}

// Helper function to generate settlement message
async function generateSettlementMessage(ward_id) {
  console.log("ward_id", ward_id);
  await getSettlements(ward_id);

  console.log("Settlements found:")

  let message 
  if (settlements.length > 0) {
    message = "CON Select your settlement:\n";
    settlements.forEach((settlement) => {
      message += `${settlement.code}. ${settlement.name}\n`;
    });
    
  }
  else {
    message = "CON Name of Settlement:\n";

  }
 

  return message;
}
 // get grievance status
async function getGrievanceStatusByCode(grievance_code) {
  try {
    // Find the grievance by its ID
    const grievance = await Grievance.findOne({ code: grievance_code }).exec();

    if (!grievance) {
      //throw new Error('Grievance not found');
      return "Not found";
    }

    // Return the status of the grievance
    return grievance.status;
  } catch (error) {
    console.error(`Error retrieving grievance status: ${error.message}`);
    return "Error retrieving status";
    throw error;
  }
}

async function getGrievanceStatusByPhone(phone) {
  try {
    // Find all grievances by phone number
    const grievances = await Grievance.find({ phone: phone }).exec();

    if (grievances.length === 0) {
      // Return a message if no grievances are found
      return [];
    }

    // Extract and return the codes of the grievances
    const grievanceCodes = grievances.map((grievance) => grievance.code);
    return grievanceCodes;
  } catch (error) {
    console.error(`Error retrieving grievances: ${error.message}`);
    return "Error retrieving grievances";
    throw error;
  }
}

// here the user accepts the reoslution
async function resolutionAction(grievance_code, action) {
  try {
    // Find the grievance by its ID
    const grievance = await Grievance.findOne({ code: grievance_code }).exec();

    const updatedGrievance = await Grievance.findOneAndUpdate(
      { code: grievance_code }, // Filter
      { resolution: action }, // Update
      { status: action == "Accepted" ? "closed" : "Rejected" },
      { new: true } // Options: Return the updated document
    ).exec();

    if (!updatedGrievance) {
      //throw new Error('Grievance not found');
      return "Not found";
    }

    // Return the status of the grievance
    return updatedGrievance.status;
  } catch (error) {
    console.error(`Error retrieving grievance status: ${error.message}`);
    return "Error retrieving status";
    throw error;
  }
}

  
  export default defineEventHandler(async (event) => {

    const mongoString = process.env.MONGODB_URI;

    await mongoose.connect(mongoString,{dbName:'grm' });
    console.log('Database in USSD connected...');

    let response;
    let state = {}; // Initialize state object
  
    try {

      const { SESSIONID, USSDCODE, MSISDN, INPUT  } =  getQuery(event);

      //const { SESSIONID, USSDCODE, MSISDN, INPUT } = req.query;
       const inputArray = INPUT.split("*");
     // const inputArray = INPUT.split("*");
    //const inputArray = INPUT.split(/(?!^)\*/);

 
      console.log('MSISDN',INPUT)
      console.log('inputArray',INPUT, inputArray)
      
     
        // Retrive the users grievances
        // make a response for it
        grievances = await getGrievanceStatusByPhone(MSISDN);
        console.log("grievances--", grievances);
      
        if (grievances.length === 0) {
          grievances_response = "END No grievances found";
        } else {
          let res = "CON Select grievance:\n";
          grievances.forEach((grv, index) => {
            res += `${index + 1}. ${grv}\n`;
          });
          grievances_response = res;
        }
      
        
        if (inputArray.length == 1) {
          sessionState.currentState = "initial";
          sessionState.currentPage = 1;
          // get counties only the first time
          getAllCounties();
        }
      
        // here we check if the step is 2 verfication and not the iital stage
        if (inputArray[1] == 2 && inputArray.length == 2) {
          sessionState.currentState = "verify";
        }
      
        if (inputArray[1] == 3 && inputArray.length == 2) {
          sessionState.currentState = "accept";
        }
      
        if (inputArray[1] == 4 && inputArray.length == 2) {
          sessionState.currentState = "reject";
        }
      
        const lastInput = inputArray[inputArray.length - 1];
      
        console.log("State:", sessionState.currentState);
        // console.log("inputArray:",inputArray)
        // console.log("inputArray[1]:",inputArray[1])
      
        if (inputArray[1] == 2) {
          // Check status flow
          switch (sessionState.currentState) {
            case "verify":
              console.log("inside verify");
              // response = "CON Enter the Grievance Reference";
              response = grievances_response;
              sessionState.currentState = "awaitingReference";
              break;
            case "awaitingReference":
              console.log("inside awaitingReference", sessionState.currentState);
      
              const grievance_code = grievances[lastInput - 1];
              const status = await getGrievanceStatusByCode(grievance_code);
      
              response = `END Your complaint ref: ${grievance_code} is ${status}`;
              break;
            default:
              response = "END Invalid input.";
          }
        }
      
       
        else if (inputArray[1] == 3) {
          // Check status flow
          switch (sessionState.currentState) {
            case "accept":
              console.log("inside accept");
              // response = "CON Enter the Grievance Reference";
              response = grievances_response;
      
              sessionState.currentState = "awaitingCodeAccept";
              break;
            case "awaitingCodeAccept":
              console.log("inside awaitingCodeAccept", sessionState.currentState);
      
              //const grievance_code = lastInput;
              const grievance_code = grievances[lastInput - 1];
      
              const status = await resolutionAction(grievance_code, "Accepted");
      
              if (status == "Not found") {
                response = `END Your complaint ref: ${grievance_code} is ${status}`;
              } else {
                response = `END Your complaint ref: ${grievance_code} is now marked resolved`;
              }
      
              break;
            default:
              response = "END Invalid input.";
          }
        } else if (inputArray[1] == 4) {
          // Check status flow
          switch (sessionState.currentState) {
            case "reject":
              console.log("inside reject");
              // response = "CON Enter the Grievance Reference";
              response = grievances_response;
      
              sessionState.currentState = "awaitingCodeReject";
              break;
            case "awaitingCodeReject":
              console.log("inside awaitingCodeAccept", sessionState.currentState);
      
              // const grievance_code = lastInput;
              const grievance_code = grievances[lastInput - 1];
      
              const status = await resolutionAction(grievance_code, "Rejected");
      
              if (status == "Not found") {
                response = `END Your complaint ref: ${grievance_code} is ${status}`;
              } else {
                response = `END Your complaint ref: ${grievance_code} is now marked resolved`;
              }
      
              break;
            default:
              response = "END Invalid input.";
          }
        } else {
          switch (sessionState.currentState) {
            case "initial":
              response =
                "CON Welcome to Grievance Reporting services.\n1. Submit a Grievance\n2. Check Status of Grievance \n3. Accept Grievance Solution \n4. Reject/Escalate Grievance Solution";
              sessionState.currentState = "awaitingOption";
              break;
      
            case "awaitingOption":
              if (lastInput == "1") {
                response = "CON Please enter your name below";
                sessionState.currentState = "awaitingName";
              } else {
                response = "END Invalid option. Please try again.";
              }
              break;
      
              case "awaitingName":
                sessionState.name = lastInput;
                response = "CON Gender.\n1. Male\n2. Female";
                sessionState.currentState = "awaitingGender";
                break;
      
      
            case "awaitingGender":
              sessionState.gender = genderList[parseInt(lastInput) - 1];
              response = generateCountyMessage(sessionState.currentPage); // Show first page of counties
              sessionState.currentState = "awaitingCounty";
              break;
      
       
      
              case "awaitingCounty":
                if (lastInput == nextPageIdentifier) {
                  sessionState.currentPage++;
                  response = generateCountyMessage(sessionState.currentPage);
                } else if (lastInput == backPageIdentifier) {
                  sessionState.currentPage--;
                  response = generateCountyMessage(sessionState.currentPage);
                } else {
                  const selectedCountyCode = parseInt(lastInput);
                  const selectedCounty = counties.find(
                    (c) => c.code === selectedCountyCode
                  );
                  if (selectedCounty) {
                    sessionState.county = selectedCounty.name;
                    response = await generateSubcountyMessage(selectedCountyCode);
                    sessionState.currentState = "awaitingSubcounty";
                  } else {
                    response = "END Invalid selection. Please try again.";
                  }
                }
                break;
      
      
            case "awaitingSubcounty":
              const selectedSubcountyCode = parseInt(lastInput);
              const selectedSubcounty = subcounties.find(
                (c) => c.code === selectedSubcountyCode
              );
              console.log()
              // const selectedSubcounty = sessionState.selectedCounty.subcounties.find(sc => sc.code === selectedSubcountyCode);
              if (selectedSubcounty) {
                sessionState.subcounty = selectedSubcounty.name;
                response = await generateWardMessage(selectedSubcountyCode);
                sessionState.currentState = "awaitingWard";
              } else {
                response = "END Invalid Ward selection. Please try again.";
              }
              break;
      
              case "awaitingWard":
                const selectedWardCode = parseInt(lastInput);
                const selectedWard = wards.find(
                  (c) => c.code === selectedWardCode
                );
        
                 if (selectedWard) {
                  sessionState.ward = selectedWard.name;
                  response = await generateSettlementMessage(selectedWardCode);
                  sessionState.currentState = "awaitingSettlement";
                } else {
                  response = "END Invalid ward selection. Please try again.";
                }
                break;
         
      
              case "awaitingSettlement":
                const selectedSettCode = parseInt(lastInput);
                const selectedSett = settlements.find(
                  (c) => c.code === selectedSettCode
                );
        
                console.log('selectedSettCode',selectedSettCode)
                if (selectedSett) {
                  sessionState.settlement = selectedSett.name;
                  sessionState.settlement_id = selectedSettCode;
                  
                } else {
                  sessionState.settlement = lastInput;
                }     
                response = "CON What's your complaint?";
                sessionState.currentState = "awaitingNature";       
      
                
                break;
        
                case "awaitingNature":
                  sessionState.complaint = lastInput;
                  response = "CON Is this related to Gender-Based Violence(GBV)?.\n1. Yes\n2. No ";
                  sessionState.currentState = "awaitingComplaint";
                  break;
      
            case "awaitingComplaint":
              //sessionState.gbv = lastInput;
              sessionState.gbv = YesNoList[parseInt(lastInput) - 1];
      
              const data = new Grievance({
                name: sessionState.name,
                gender: sessionState.gender,
                county: sessionState.county,
                subcounty: sessionState.subcounty,
                ward: sessionState.ward,
                settlement: sessionState.settlement,
                settlement_id: sessionState.settlement_id,
                complaint: sessionState.complaint,
                gbv: sessionState.gbv,
                phone: MSISDN,
                network: SESSIONID,
                status: "Open",
                resolution: "Pending", // default
              });
      
              const code = await generateGrievanceReferenceNumber();
              data.code = code;
         
            
      
                try {
                  const savedGrv = await data.save();
                  console.log('savedGrv saved:', savedGrv);
      
                  data.id = savedGrv._id; 
                  sendSMS(data);
      
                } catch (err) {
                  console.error(err);
                }
      
       
            
              response =
                "END Your feedback has been received. We will send a confirmation SMS shortly.";
              delete state[SESSIONID]; // Clear the state for the session
              break;
      
            default:
              response = "END Invalid option. Please try again.";
          }
        }
      
    //    res.setHeader("Content-Type", "text/plain");
    //    res.send(response);
     console.log(response)
 
      return {response       };
    } catch (error) {
      console.error('Error during submission:', error);
      return {response }  
      }
 });
 