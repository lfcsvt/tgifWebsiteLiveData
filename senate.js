// it is the array where our data is stored
//var senData = data.results[0].members
// gets  the rows will be placed oon the html file
var tblBody = document.getElementById("putTheRowsHere")
// gets the element where the table is in the html file
var tbl = document.getElementById("myTable");
// create the row for out table
var row = document.createElement("tr");
// this function creates a table with all of the objects in the data array using only the selected values of each object
function createOriginalTable(senData) {
    // this clears the table body everytime we start a function   
    tblBody.innerHTML = ""
    for (var i = 0; i < senData.length; i++) {

        if (senData[i].middle_name === null) {
            senData[i].middle_name = " "
        }

        var fullName = senData[i].first_name + ' ' + senData[i].middle_name + ' ' + senData[i].last_name
        var row = document.createElement("tr");

        row.insertCell().innerHTML = fullName.link(senData[i].url)
        row.insertCell().innerHTML = senData[i].party
        row.insertCell().innerHTML = senData[i].state
        row.insertCell().innerHTML = senData[i].seniority
        row.insertCell().innerHTML = senData[i].votes_with_party_pct + "%"

        tblBody.appendChild(row);

    }
    tbl.appendChild(tblBody);
    tbl.setAttribute("class", "table table-hover");
}




//this function populate the states in the seletc state box
function createSelect(senData) {

    //create array with state values extracted from the data to populate the states in the seletc state box
    var stateArray = []
    var newArray = []
    for (var i = 0; i < senData.length; i++) {

        stateArray.push(states = senData[i].state)
        stateArray.forEach(function (item) {
            if (newArray.indexOf(item) < 0) {
                newArray.push(item);
            }
        });
        newArray.sort()

    }

    //this code feeds the     
    var select = document.getElementById("selectState");

    for (var i = 0; i < newArray.length; i++) {
        var opt = newArray[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

// this function creates the filter for the table by party and state
function checkMyCh(senData) {
    // this varuiable determines the value the user choose in the select state box    
    var stateValue = document.getElementById("selectState").value;
    // this variables returns the value chosen when the checkbox is checked in the form of an array and it returns a inpute value to be a condition for creting the table
    var checkedCheckbox = Array.from(document.querySelectorAll('input[name=parties]:checked')).map(function (oneInput) {
        return oneInput.value
    });
    // this condition creates a table when neither checkboxes or state select are activated(returns all unfiltered data)
    if (checkedCheckbox.length === 0 && stateValue === "all") {
        createOriginalTable(senData)
        //this condition will create a filtered by party as the state is not selected   
    } else if (checkedCheckbox.length > 0 && stateValue === "all") {
        tblBody.innerHTML = ""
        for (var i = 0; i < senData.length; i++) {
            if (checkedCheckbox.includes(senData[i].party)) {
                createFilteredTable(senData[i])
            }
        }
        // this condition creates a table if objects that filtering only by state.(checkbos is not checked and state is one state)        
    } else if (checkedCheckbox.length === 0 && stateValue !== "all") {
        tblBody.innerHTML = ""
        for (var i = 0; i < senData.length; i++) {
            if (stateValue === senData[i].state) {
                createFilteredTable(senData[i])
            }
        }

        // this creates a table filtered by party and state take both values inputed and create a table by party and state
    } else {
        tblBody.innerHTML = ""
        for (var i = 0; i < senData.length; i++) {
            if (checkedCheckbox.includes(senData[i].party) && stateValue === senData[i].state) {

                createFilteredTable(senData[i])
            }
        }
    }

}

function createFilteredTable(senator) {

    if (senator.middle_name === null) {
        senator.middle_name = " "
    }

    var fullName = senator.first_name + ' ' + senator.middle_name + ' ' + senator.last_name
    var row = document.createElement("tr");

    row.insertCell().innerHTML = fullName.link(senator.url)
    row.insertCell().innerHTML = senator.party
    row.insertCell().innerHTML = senator.state
    row.insertCell().innerHTML = senator.seniority
    row.insertCell().innerHTML = senator.votes_with_party_pct + "%"

    tblBody.appendChild(row);
}

function getData() {
    fetch('https://api.propublica.org/congress/v1/113/senate/members.json', {
            headers: new Headers({
                'X-API-Key': 'XiS3U2dJVOswHAgjUcMNIBkG4aANYLQIBCowZeNB'
            })
        })
        .then(response => response.json())
        .then(response => {
            const senData = response.results[0].members
            createOriginalTable(senData),
                createSelect(senData),
                activateEventListeners(senData)



//            console.log(senData)
        })


        .catch(err => console.log(err));
}

window.onload = () => getData()

function activateEventListeners(senData) {
    Array.from(document.querySelectorAll('input[name="parties"]'))
        .forEach(input => input.addEventListener('change', () => checkMyCh(senData)))

    document.querySelector('#selectState').addEventListener('change', () => checkMyCh(senData))
}


