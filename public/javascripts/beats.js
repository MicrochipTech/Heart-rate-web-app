$(document).ready(function () {
  var timeData = [],
    heartbeatData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Heart Beats',
        yAxisID: 'Heart Beats',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: heartbeatData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Heart beats Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Beats',
        type: 'linear',
		ticks: {
                max: 120,
                min: 40,
                stepSize: 20
            },
        scaleLabel: {
          labelString: 'Beats',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      
      timeData.push(obj.time);

      // only keep no more than 50 points in the line chart
      const maxLen = 20;
      var len = timeData.length;

      if (obj.humidity) {
        heartbeatData.push(obj.humidity);
      }
      if (heartbeatData.length > maxLen) {
        heartbeatData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
