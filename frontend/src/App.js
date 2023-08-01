import "./App.css";
import axios from "axios";

function App() {

  async function backendCall() {
    const response = await axios.get("http://localhost:8080/");
    console.log(response.data);
  }


  return (
    <div className="App">
      <button onClick={backendCall}>Fetch Hello</button>
    </div>
  );
}

export default App;
