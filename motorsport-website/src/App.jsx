import ListGroup from "./components/ListGroup";

function App() {
  var items = ["Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta"];
  items = [];

  return (
    <>
      <div>
        <h1>List:</h1>
        {items.length === 0 && <p>No items found</p>}
        <ul className="list-group">
          {items.map((item) => (
            <li
              className="list-group-item"
              onClick={() => console.log("clicked")}
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
