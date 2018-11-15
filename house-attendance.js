function getData() {
    fetch('https://api.propublica.org/congress/v1/113/house/members.json', {
            headers: new Headers({
                'X-API-Key': 'XiS3U2dJVOswHAgjUcMNIBkG4aANYLQIBCowZeNB'
            })
        })
        .then(response => response.json())
        .then(response => {
            const senData = response.results[0].members
            //            createOriginalTable(senData),
            //                createSelect(senData),
            //                activateEventListeners(senData)
//            leastLoyal(senData)
//                leastLoyalMembers(senData)
//                percentage(senData)
//                mostLoyal(senData)
//                mostLoyaMembers(senData)
                main(senData)
        })

        .catch(err => console.log(err));
}

function main(senData){
    mostEngaged(senData)
    leastEngaged(senData)
    leastEngagedtable(senData)
    mostEngagedtable(senData)
    numbersTable(senData)
    statistics.numOfDemocrats = count(senData, "D")
    statistics.numOfRepublicans = count(senData, "R")
    statistics.numOfIndependents = count(senData, "I")
    statistics.numberOfMembers = count(senData, "I") + count(senData, "D") + count(senData, "R")
    statistics.percentOfDemocrats = percentVoted(senData, "D")
    statistics.percentOfRepublicans = percentVoted(senData, "R")
    statistics.percentOfIndependents = percentVoted(senData, "I")
    statistics.percentOfMembers = totalPercentage(senData).toFixed(2)
    statistics.allOfMostLoyal = mostLoyalMembers(senData)
    statistics.allOfLeastLoyal = leastLoyalMembers(senData)
    statistics.allOfMostEngaged = mostEngagedMember(senData)
    statistics.allOfLeastEngaged = leastEngagedMember(senData)
    
   
    console.log(statistics)
   
}

var statistics = { 
 numOfDemocrats: 0,
 numOfRepublicans: 0,
 numOfIndependents: 0,
 numberOfMembers: 0,
 percentOfDemocrats: 0,
 percentOfRepublicans: 0,
 percentOfIndependents: 0,
 percentOfMembers: 0,
 allOfMostLoyal: 0,
 allOfLeastLoyal: 0,
allOfMostEngaged: 0,
allOfLeastEngaged: 0
}

window.onload = () => getData()
// count the mumber of member per each party, takes one argument partyCode, in this case "D", "R" or "I"
function count(senData, partyCode) {
    return senData
        .filter(senator => senator.party === partyCode)
        .length
}

// calculate the percentage the members voted with the party, takes one argument partyCode, in this case "D", "R" or "I"
function percentVoted(senData, partyCode) {
    var memberspercent = []
    var members = senData.filter(senator => senator.party === partyCode)
    for (var i = 0; i < members.length; i++) {
        memberspercent.push(senData[i].votes_with_party_pct)

    }

    // this sums up all the values and the the result is divided by the number of members to create an average  
    memberspercent = memberspercent.reduce((a, b) => a + b, 0) / members.length
    memberspercent = memberspercent.toFixed(2);
    return memberspercent
}
// returns the lowest votes missed percentage of the chosen percentage, pass by the pecentage(percent , with one parameter passed), returning a minimum to be compared in the leastEngagedMember().
function mostEngaged(senData) {
    var allMissed = []
    senData.forEach(member => {
        allMissed.push(member.missed_votes_pct)
        allMissed = allMissed.sort((a, b) => a - b).slice(0, senData.length / 100 * 10);

    })
    
    return Math.max(...allMissed)
    //    return allMissed
}
// returns the highest votes missed percentage of the chosen percentage of congressmen, pass by the pecentage(percent , with one parameter passed)
function leastEngaged(senData) {
    var leastMissed = []
    senData.forEach(member => {
        leastMissed.push(member.missed_votes_pct)
        leastMissed = leastMissed.sort((a, b) => b - a).slice(0, senData.length / 100 * 10 );
    })

    return Math.min(...leastMissed)
}

// filters most engaged member by getting the member whon mossed votes percentage is lower that set at mostEngaged()
function mostEngagedMember(senData) {
    return senData.filter(member => member.missed_votes_pct <= mostEngaged(senData))

}
// filters most engaged member by getting the member whon mossed votes percentage is lower that set at leastEngaged()
function leastEngagedMember(senData) {
    
    return senData.filter(member => member.missed_votes_pct >= leastEngaged(senData))

}

// returns the highest votes with party percentage of the chosen percentage of congressmen, pass by the pecentage(percent , with one parameter passed)
function mostLoyal(senData) {
    var loyalUp = []
    senData.forEach(member => { 
        loyalUp.push(member.votes_with_party_pct)
        loyalUp = loyalUp.sort((a, b) => b - a).slice(0, senData.length / 100 * 10)
//                                      
    })
    return Math.min(...loyalUp)
}

// returns the lowest votes with party percentage of the chosen percentage of congressmen, pass by the pecentage(percent , with one parameter passed)
function leastLoyal(senData) {
    var loyalDown = []
    senData.forEach(member => {
        loyalDown.push(member.votes_with_party_pct)
        loyalDown = loyalDown.sort((a, b) => a - b).slice(0, senData.length / 100 * 10);

    })
   
    return Math.max(...loyalDown)
    //        return loyalDown 
}
// returns an array where the vote with party percentage of the member are higer than the min determined in the mostLoyal()
function mostLoyalMembers(senData) {
    return senData.filter(member => member.votes_with_party_pct >= mostLoyal(senData))

}

// returns an array where the vote with party percentage of the member are higer than the min determined in the leastLoyal()
function leastLoyalMembers(senData) {
//    console.log(senData.filter(member => member.votes_with_party_pct <= leastLoyal(senData))) 
    return senData.filter(member => member.votes_with_party_pct <= leastLoyal(senData))

}
// create a function to calculate the total of votes percentage
function totalPercentage(senData) {
    var membersPercentTotal = []
    for (var i = 0; i < senData.length; i++) {
        membersPercentTotal.push(senData[i].votes_with_party_pct)
        var result = membersPercentTotal.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    return result / senData.length
}


// creates a table with the most engaged members
function mostEngagedtable(senData) {
    var table = document.getElementById('mostEngaged')
    var tBody = document.getElementById('mostEngagedBody')
    var newArr = statistics.allOfMostEngaged = mostEngagedMember(senData)
    var fullName = senData.map(member => member.first_name + " " + member.middle_name + " " + member.last_name)
    for (var i = 0; i < newArr.length; i++) {
    
        if (newArr[i].middle_name === null) {
            newArr[i].middle_name = " "
        }

        var fullName = newArr[i].first_name + ' ' + newArr[i].middle_name + ' ' + newArr[i].last_name
        var row = document.createElement("tr");

        row.insertCell().innerHTML = fullName.link(newArr[i].url)
        row.insertCell().innerHTML = newArr[i].missed_votes
        row.insertCell().innerHTML = newArr[i].missed_votes_pct


        tBody.appendChild(row);


        table.appendChild(tBody);
    }
    table.setAttribute("class", "table table-hover")
}

// creates a table with the least engaged members
function leastEngagedtable(senData) {
    var table = document.getElementById('leastEngaged')
    var tBody = document.getElementById('leastEngagedBody')
    var newArr = statistics.allOfLeastEngaged = leastEngagedMember(senData)
    var fullName = senData.map(member => member.first_name + " " + member.middle_name + " " + member.last_name)
    for (var i = 0; i < newArr.length; i++) {
        if (newArr[i].middle_name === null) {
            newArr[i].middle_name = " "
        }

        var fullName = newArr[i].first_name + ' ' + newArr[i].middle_name + ' ' + newArr[i].last_name
        var row = document.createElement("tr");

        row.insertCell().innerHTML = fullName.link(newArr[i].url)
        row.insertCell().innerHTML = newArr[i].missed_votes
        row.insertCell().innerHTML = newArr[i].missed_votes_pct


        tBody.appendChild(row);

        table.appendChild(tBody);
    }
    table.setAttribute("class", "table table-hover")
}

// creates the table with the number of congresmen per party and a total
function numbersTable(senData) {
    var table = document.getElementById("totalMembers")
    var tBody = document.getElementById("totalMembersBody")
    var newArray = cretaArray(senData)

    for (var i = 0; i < newArray.length; i++) {
        var row = document.createElement("tr");
        row.insertCell().innerHTML = newArray[i].name
        row.insertCell().innerHTML = newArray[i].numberOfMembers
        row.insertCell().innerHTML = newArray[i].votesPercentage

        tBody.appendChild(row);
    }
    table.appendChild(tBody);
    table.setAttribute("class", "table table-hover")

}

// create an array of objects called statistics

function cretaArray(senData){
    var array =  [{
        name: statistics.nameOfDemocrats = 'Democrats',
        numberOfMembers: statistics.numOfDemocrats = count(senData, "D"),
        votesPercentage: statistics.percentOfDemocrats = percentVoted(senData, "D")},
                  {
        name: statistics.nameOfRepublicans = 'Republicans',
        numberOfMembers: statistics.numOfDemocrats = count(senData, "R"),
        votesPercentage: statistics.percentOfDemocrats = percentVoted(senData, "R")},
                  {
        name: statistics.nameOfIndependents = 'Independents',
        numberOfMembers: statistics.numOfDemocrats = count(senData, "I"),
        votesPercentage: statistics.percentOfDemocrats = percentVoted(senData, "I")},
                  {
         name: statistics.nameOfTotal = "Total",
        numberOfMembers: statistics.numberOfMembers = count(senData, "I") + count(senData, "D") + count(senData, "R"),
        votesPercentage: statistics.percentOfMembers = totalPercentage(senData).toFixed(2)}
                 ]
        console.log(array)
    return array
    
}



