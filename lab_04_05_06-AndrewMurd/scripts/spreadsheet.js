// Number of columns and rows the data has
var rows = 0;
var cols = 0;

// Get data from csv file
fetch('grades.csv')
.then((resp) => resp.text())
.then(function(data) {
    generateTable(data);
})
.catch(function(error) {
    console.log(error);
});

// Generate table dynamically
function generateTable(data) {
    var allRows = data.split(/\r?\n|\r/);
    rows = allRows.length - 1;
    cols = allRows[0].split(",").length - 1;
    var table = document.getElementById("dataTable");

    for (let i = -1; i < rows; i++) {
        var row = document.createElement("tr");
        var dataRow = allRows[i + 1].split(",");
        if (i == -1) {
            $(row).addClass("header");
        }
        for (let j = -1; j < cols; j++) {
            var col = document.createElement("td");
            var idName = i + ',' + j;
            col.setAttribute("id", idName);
            // Multiply assignment marks by 10
            if (-1 < j && j < 3 && i > -1) {
                $(col).html(dataRow[j + 1] * 10);
            } else {
                $(col).html(dataRow[j + 1]);
            }
            row.appendChild(col);
            if (j == -1) {
                $(col).addClass("header");
            }
        }
        table.appendChild(row);
    }

    // handlers for td cells in table
    $("td").click(function() {
        // get id of cell
        let id = $(this).attr('id');
        idArray = id.split(',');
        let row = idArray[0];
        let col = idArray[1];
        let txtF = document.createElement("input");
    
        deselectAll();
        
        if ($(this).children().length == 0) {
            txtF.value = $(this).html();
            $(txtF).addClass("txtField");
            $(this).html(txtF);
            $(this).focus();
        }
        // if a row is selected
        if (col == -1 && row > -1) {
            selectRow(row);
            let dataArray = extractData(row, 0);
            let dataDict = letterGradeFreq(dataArray);
            generateGraph(dataDict);
        }
        // if a col is selected
        if (row == -1 && col > -1) {
            selectColumn(col);
            let dataArray = extractData(col, 1);
            let dataDict = letterGradeFreq(dataArray);
            generateGraph(dataDict);
        }
    });

    // change value on enter keypress
    $("td").keypress(function(event) {
        if (event.which == 13) {
            $(this).html($(this).children().val());
        }
    });
}

function deselectAll() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cell = document.getElementById(i + "," + j);
            $(cell).removeClass("selected");
        }
    }
}

function selectRow(rowIndex) {
    for (let i = 0; i < cols; i++) {
        cell = document.getElementById(rowIndex + "," + i);
        $(cell).addClass("selected");
    }
}

function selectColumn(colIndex) {
    for (let i = 0; i < rows; i++) {
        cell = document.getElementById(i + "," + colIndex);
        $(cell).addClass("selected");
    }
}

// get data from column or row
function extractData(index, type) {
    let dataArray;
    if (type == 0) {
        dataArray = new Array(cols);
        for (let i = 0; i < cols; i++) {
            cell = document.getElementById(index + "," + i);
            dataArray[i] = $(cell).html();
        }
    } else {
        dataArray = new Array(rows);
        for (let i = 0; i < rows; i++) {
            cell = document.getElementById(i + "," + index);
            dataArray[i] = $(cell).html();
        }
    }
    return dataArray;
}

// calculate grade freq
function letterGradeFreq(data) {
    let arrayDict = [
        {grade: "A", frequency: 0},
        {grade: "B", frequency: 0},
        {grade: "C", frequency: 0},
        {grade: "D", frequency: 0},
        {grade: "F", frequency: 0}
    ];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < arrayDict.length; j++) {
            if (arrayDict[j].grade == getGrade(data[i]/10)) {
                arrayDict[j].frequency += 1;
                break;
            }
        }
    }
    // calculate the percentage of each grade
    let total = 0;
    for (let j = 0; j < arrayDict.length; j++) {
        total += arrayDict[j].frequency;
    }
    for (let j = 0; j < arrayDict.length; j++) {
        arrayDict[j].frequency = arrayDict[j].frequency / total;
    }
    return arrayDict;
}

function getGrade(mark) {
    if (mark < 5.0) {
        return 'F';
    } else if (mark < 6.0) {
        return 'D';
    } else if (mark < 7.0) {
        return 'C';
    } else if (mark < 8.0) {
        return 'B';
    } else {
        return 'A';
    }
}