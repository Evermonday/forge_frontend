import axios from 'axios'

export default function Dashboard() {
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get('http://localhost:8181/api/dashboard')
      .then((response) => {
        console.log(response);
      })
    
  };

  return (
    <div>
      <h2>General Information (DASHBOARD TEMP)</h2>
      <button onClick={handleSubmit}>
        click
      </button>
    </div>
  );
}
