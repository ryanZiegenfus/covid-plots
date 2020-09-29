import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import Plot from 'react-plotly.js';
function App() {

  const[data, setData] = useState([])
  const[powerRegression, setPowerRegression] = useState([])

  useEffect(() => {
    axios.get('https://api.covidtracking.com/v1/us/daily.json')
    .then(res => {
      setData(calculateNewCasesAndRegressionSums(res.data.filter(e => e.date > 20200712)))
    })
    .catch()
  },[])
  
  
  
  function calculateNewCasesAndRegressionSums(arr) {
    let outputArray = []
    var sumOfWZ = 0
    var sumW = 0
    var sumZ = 0
    var sumWsquared = 0
    for(let i = 1; i < arr.length; i++) {
      sumOfWZ += ((i - 1) * arr[arr.length - (i + 1)].positive - arr[arr.length - i].positive)
      sumW += (i - 1)
      sumWsquared += ((i - 1) * (i - 1))
      sumZ += (arr[arr.length - (i + 1)].positive - arr[arr.length - i].positive)
      outputArray.push(arr[arr.length - (i + 1)].positive - arr[arr.length - i].positive)
    }

    let n = arr.length - 1
    let a1 = ((n*sumOfWZ) - (sumW*sumZ))/((n*sumWsquared) - (sumW*sumW))
    let zAvg = sumZ / n
    let wAvg = sumW / n
    let a0 = zAvg - (a1 * wAvg)
    let a = Math.exp(Math.round(a0))
 

    let a1Top = ((n*sumOfWZ) - (sumW*sumZ))
    let a1Bot = ((n*sumWsquared) - (sumW*sumW))
    console.log(n)
    console.log(a1Top)
    console.log(a1Bot)
    console.log(zAvg)
    console.log((a1Top/a1Bot) * wAvg)
    // console.log(n)
    // console.log(sumOfWZ)
    // console.log(sumW)
    // console.log(sumZ)
    // console.log(sumWsquared)
    // console.log(a1)
    
    let regressionArray = []

    for(let i = 1; i < arr.length; i++) {
      regressionArray.push(a * Math.pow((i - 1), a1))
      console.log(a * Math.pow((i - 1), a1))
    }
    setPowerRegression(regressionArray)

    return outputArray
  }


  return (
    <div className="App">
      <Plot
        data={[
          {
            x: [] * data.length,
            y: data,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {
            x: [] * data.length,
            y: powerRegression,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue'},
          },
        ]}
        layout={ {width: 920, height: 1000, title: 'New Cases By Day'} }
       />
    </div>
  );
}

export default App;
