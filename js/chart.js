
//https://developers.google.com/chart/interactive/docs/gallery/linechart
google.charts.load('current', {'packages':['line', 'table']});
google.charts.setOnLoadCallback(init);


// ||| Fetch UsersData and weightData from database.json/json-server
async function fetchData() {
  try {
      const responseUsers = await fetch('http://localhost:3001/usersData');
      const responseWeight = await fetch('http://localhost:3001/weightData');

      if (!responseUsers.ok || !responseWeight.ok) {
          throw new Error('Failed to fetch data.');
      }

      const usersData = await responseUsers.json();
      const weightData = await responseWeight.json();

      return {
          usersData,
          weightData
      };
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

// ||| Functions for google charts
// users-chart dataprocess and options
// weight-chart dataprocess and options
// draw and update

//functions and options for usersData
function processUsersData(rawData) {
  let sortedData = rawData.usersData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Päivämäärä');
  dataTable.addColumn('number', 'Käyttäjät');
  
  sortedData.forEach(item => {
    dataTable.addRow([item.date, Number(item.users)]);
  });
  
  return dataTable;
}


const usersOptions = {
  chart: {
    title: 'Käyttäjätilastot'
  },
  series: {
    0: {axis: 'Käyttäjät'}
  },
  axes: {
    x: {
      0: { side: 'bottom', label: 'Päivämäärä' }
    },
    y: {
      Users: {label: 'Käyttäjät'}
    }
  },
  columnIndices: [0, 1], // Fixed columns
  width: '100%',
  height: 400,
  
};


//functions and options for weightData
function processWeightData(rawData) {
  let dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Kuukausi');
  dataTable.addColumn('number', 'Keskimääräinen muutos (kg)');
  dataTable.addColumn('number', 'Mediaani muutos (kg)');
  dataTable.addColumn('number', 'Käyttäjiä (määrä)');
  dataTable.addColumn('number', 'Keskihajonta (kg)');

  rawData.weightData.forEach(item => {
      dataTable.addRow([
          String(item.month),
          item.averageChange,
          item.medianChange,
          item.count,
          item.standardDeviation
      ]);
  });

  return dataTable;
}

const weightOptions = {
  chart: {
    title: 'Painonmuutostilastot'
  },
  series: {
    0: {axis: 'Metrics'},
    1: {axis: 'Metrics'},
    2: {axis: 'Count'},
    3: {axis: 'Metrics'}
  },
  axes: {
    y: {
      Metrics: {label: 'Kg'},
      Count: {label: 'Määrä'}
    }
  },
  columnIndices: [], //Dynamic columns
  width: '100%',
  height: 400,
  
};


//Set columnIndices for weightOptions
function getMetricsSelection() {
  let selectedColumns = [0];

  if (document.getElementById("averageChangeCheckbox").checked) selectedColumns.push(1);
  if (document.getElementById("medianChangeCheckbox").checked) selectedColumns.push(2);
  if (document.getElementById("countCheckbox").checked) selectedColumns.push(3);
  if (document.getElementById("standardDeviationCheckbox").checked) selectedColumns.push(4);

  return selectedColumns;
}

// Now lets draw charts
function drawChart(dataTable, elementId, options) {
  let container = document.getElementById(elementId);

  if (container) {
    let view = new google.visualization.DataView(dataTable);
    view.setColumns(options.columnIndices); // Set columns from options

    let chart = new google.charts.Line(container);
    chart.draw(view, google.charts.Line.convertOptions(options));
  } else {
    console.error(`Element with id ${elementId} not found.`);
  }
}

// The chart update cycle: fetch, process, draw
async function updateChart(rawData) {

  const usersData = processUsersData(rawData);
  const weightData = processWeightData(rawData);

  weightOptions.columnIndices = getMetricsSelection(); 

  drawChart(usersData, 'users_chart', usersOptions);
  drawChart(weightData, 'weight_chart', weightOptions);
}

function handleWindowResize(rawData) {
  updateChart(rawData); 
  //Add functions...
}

// Funcion for button click
async function updateChartClick() {
  const rawData = await fetchData();
  await updateChart(rawData);
}

// ||| Functions for spreadsheet
function drawTable(dataTable) {
  const table = new google.visualization.Table(document.getElementById('table_div')); // 'table_div' is where the table will be drawn
  table.draw(dataTable);
}

async function drawUsersTable(rawData) {
  const usersDataTable = processUsersData(rawData);
  drawTable(usersDataTable);
}


// ||| Functions for data-cards:
function getCurrentUsers(rawData) {
  if (!rawData || !rawData.usersData || rawData.usersData.length === 0) {
      console.error('Error retrieving user data.');
      return null;
  }

  rawData.usersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const latestMonthData = rawData.usersData[0];

  return latestMonthData.users;
}

function getAverageWeightChange(rawData) {
  if (!rawData || !rawData.weightData || rawData.weightData.length === 0) {
    console.error('Error retrieving weight data.');
    return null;
  }

  const totalChange = rawData.weightData.reduce((acc, monthData) => acc + monthData.averageChange, 0);
  const averageChangePerMonth = totalChange / rawData.weightData.length;
  
  return averageChangePerMonth;
}

function getTotalWeightLoss(rawData) {
  if (!rawData || !rawData.weightData || rawData.weightData.length === 0) {
      console.error('Error retrieving weight data.');
      return null;
  }
  return rawData.weightData.reduce((acc, monthData) => acc + (monthData.averageChange * monthData.count), 0);

}


//Update cards in DOM
function updateDataCards(rawData) {
  const currentUsersValue = getCurrentUsers(rawData);
  const averageWeightChangeValue = getAverageWeightChange(rawData);
  const totalWeightLossValue = getTotalWeightLoss(rawData);

  if(currentUsersValue !== null) {
      document.getElementById('currentUsers').innerText = currentUsersValue;
  } else {
      document.getElementById('currentUsers').innerText = "Data not available";
  }

  if(averageWeightChangeValue !== null) {
      document.getElementById('avgWeightChange').innerText = averageWeightChangeValue.toFixed(2);
  } else {
      document.getElementById('avgWeightChange').innerText = "Data not available";
  }

  if(totalWeightLossValue !== null) {
      document.getElementById('totalWeightLoss').innerText = totalWeightLossValue.toFixed(0);
  } else {
      document.getElementById('totalWeightLoss').innerText = "Data not available";
  }
}


// ||| Launch everything
async function init() {
  const rawData = await fetchData();
  
  await updateChart(rawData);
  await drawUsersTable(rawData);
  updateDataCards(rawData);
  
  window.addEventListener('resize', () => {
    handleWindowResize(rawData);
  });
}

