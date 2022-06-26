import './App.css';
import React from 'react'

const backend_url = "https://71a7-2a02-2f0d-2103-a300-6bf-4f39-2698-fbff.eu.ngrok.io"

function App() {
  const [saveModel, setSaveModel] = React.useState()
  const [loadModel, setLoadModel] = React.useState()
  const [dataset, setDataset] = React.useState()
  const [convDimension, setConvDimension] = React.useState()
  const [k, setK] = React.useState()
  const [filtre, setFiltre] = React.useState()
  const [nl0, setNl0] = React.useState()
  const [nl1, setNl1] = React.useState()
  const [dropout, setDropout] = React.useState()
  const [lr, setLr] = React.useState()
  const [epochs, setEpochs] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [modelResponse, setModelResponse] = React.useState()

    const chooseDataset = (dataset) => {
      setDataset(dataset)
    }

    const onChangeK = (value) => {
      setK(value)
    }

    const onChangeFiltre = (value) => {
      setFiltre(value)
    }

    const onChangeNl0 = (value) => {
      setNl0(value)
    }

    const onChangeNl1 = (value) => {
      setNl1(value)
    }

    const onChangeDropout = (value) => {
      setDropout(value)
    }

    const onChangeLr = (value) => {
      setLr(value)
    }

    const onChangeEpochs = (value) => {
      setEpochs(value)
    }

    const onChangeConvDim = (value) => {
      setConvDimension(value)
    }

    const createAndTrainModel = async () => {
      setLoading(true);
      var body = {
        "save_model": saveModel,
        "load_model": loadModel,
        "dataset": dataset,
        "conv_dimension": convDimension,
        "k": parseFloat(k),
        "nr_filtre": parseInt(filtre),
        "nonlinear_layer_0": parseInt(nl0),
        "nonlinear_layer_1": parseInt(nl1),
        "dropout": parseFloat(dropout),
        "learning_rate": parseFloat(lr),
        "epochs": parseInt(epochs)
      }
      console.log(body)
      const response = await fetch(backend_url + "/create-and-train", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      body: JSON.stringify(body) // body data type must match "Content-Type" header
      });

      response.json().then(data => {
        console.log(data)
        setModelResponse(data)
        setLoading(false)
      })
    }

    const chooseParameters = () => {
      return dataset ?
          <div className = "create-model">
            <p className="title-dataset">Creeaza modelul</p>

            <p>Salveaza un model cu numele:</p>
            <input type="text" onChange = {(ev)=>{setSaveModel(ev.target.value)}} value = {saveModel}/>

            <p>Incarca modelul cu numele:</p>
            <input type="text" onChange = {(ev)=>{setLoadModel(ev.target.value)}} value = {loadModel}/>

            <p>Conv dimension (1D or 2D):</p>
            <input type="text" onChange = {(ev)=>{onChangeConvDim(ev.target.value)}} value = {convDimension}/>

            <p>k:</p>
            <input type="number" onChange = {(ev)=>{onChangeK(ev.target.value)}} value = {k}/>

            <p>Numarul de filtre:</p>
            <input type="number" onChange = {(ev)=>{onChangeFiltre(ev.target.value)}} value = {filtre}/>

            <p>Straturi neliniare - nl0</p>
            <input type="number" onChange = {(ev)=>{onChangeNl0(ev.target.value)}} value = {nl0}/>

            <p>Straturi neliniare - nl1</p>
            <input type="number" onChange = {(ev)=>{onChangeNl1(ev.target.value)}} value = {nl1}/>

            <p>Dropout:</p>
            <input type="number" onChange = {(ev)=>{onChangeDropout(ev.target.value)}} value = {dropout}/>

            <p>Rata de invatare:</p>
            <input type="number" onChange = {(ev)=>{onChangeLr(ev.target.value)}} value = {lr}/>

            <p>Epoci: </p>
            <input type="number" onChange = {(ev)=>{onChangeEpochs(ev.target.value)}} value = {epochs}/>

            <button onClick={()=>{createAndTrainModel() }} className="button">Creeaza si antreneaza modelul</button>
          </div>
          :
          <div className = "dataset-choice">
            <p className="title-dataset">Alege dataset-ul</p>
            <button onClick={()=>{chooseDataset("Voice command")}} style={{margin: "5px 0px 5px 0px"}} className='button'>Voice command</button>
            <button onClick={()=>{chooseDataset("EmoDB")}} style={{margin: "5px 0px 5px 0px"}} className='button'>EmoDB</button>
            <button onClick={()=>{chooseDataset("Bonn-EEG")}} style={{margin: "5px 0px 5px 0px"}} className='button'>Bonn-EEG</button>
          </div>

    }

    const showResults = () => {
      return <div className={"results"}>
          <p>Model</p>
          <div style = {{width: 500, height: 500, overflowY: "auto"}}>
          <img style ={ {width: 500} }  src={backend_url + modelResponse.model}/>
          </div>

                      <p>Validare</p>
                      <img style = {{width:500}} src={backend_url + modelResponse.validation}/>


          <p>Acuratete pe lot de test</p>
          <p>{modelResponse.accuracy}</p>

          <p>Timpul de executie pe lotul de test (marime lot de test: {modelResponse.test_data_length})</p>
          <p>{modelResponse.prediction_time}</p>

          <p>Timpul de executie pe un exemplu de test</p>
          <p>{modelResponse.prediction_time_1_sample}</p>

      </div>
    }
    return (
    <div className="App">
      {loading ?
          <div className="spinner-container">
            <div className="loading-spinner">
            </div>
          </div>
          :
          null
      }

        {!modelResponse ? chooseParameters() : showResults()}

    </div>
  );
}

export default App;
