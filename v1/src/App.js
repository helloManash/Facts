import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
// const initialFacts = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//     source:
//       "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//     category: "society",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: "Lisbon is the capital of Portugal",
//     source: "https://en.wikipedia.org/wiki/Lisbon",
//     category: "society",
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];

function App() {
  const [showForm, setShowForm] = useState(false);
  
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const handleClick = () =>{
    setShowForm((showForm) => showForm =!showForm);
  }
  useEffect(()=> {
    async function getFacts(){
      setIsLoading(true);
      let query = supabase.from('facts').select("*");
      if(currentCategory !== "all"){
        query.eq("category", currentCategory);
      }
      const {data: facts, error} = await query.order("like",{ascending: false}).limit(15);
      if(!error){
        setFacts(facts);
      }
      else{
        alert("Problem");
      }
      setIsLoading(false);
    }
    getFacts();
  },[currentCategory]);
  return (
    <>
      <Header showForm={showForm} handleClick={handleClick}/>
      {showForm ? <NewFactForm facts={facts} setFacts={setFacts}/> : null}
      <main>
        <CategoryFilter setCurrentCategory = {setCurrentCategory}/>
        {isLoading? <Loader/>: <FactList facts={facts} setFacts={setFacts}/>}
        
      </main>
    </>
  );
}
function Loader(){
  return <div>Loading...</div>
}
function Header({showForm,handleClick}){
  return <header>
  <div className="logo">
    <img
      src="logo.png"
      height="120"
      width="120"
      alt="Today I learned logo"
    />
    <h1>Today I learned</h1>
  </div>

<button className="btn btn-large btn-open" onClick={handleClick}>{!showForm? "SHARE A FACT": "CLOSE"}</button>
</header>
}
function NewFactForm({facts, setFacts}) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const len = text.length;
  let error = false;
  const handleSubmit = async (e) =>{
    error = false;
    e.preventDefault();
    if(text && isValidHttpUrl(source) && category && len <= 200 && len >= 0){
      setIsUploading(true);
      const {data: newFact, error} = await supabase.from("facts").insert({fact: text, source, category}).select();
      if(!error){
        setFacts([newFact[0], ...facts]);
        setText("");
        setSource("");
        setCategory("");
        setIsUploading(false);
      }
      else{
        alert("There is a problem");
        setIsUploading(false);
      }
      
    }
    else{
      error = true;
    }
  }
  const handleText = (e) =>{
    setText(e.target.value);
  }
  const handleSource = (e) =>{
    setSource(e.target.value);
  }
  const handleCategory = (e) =>{
    setCategory(e.target.value);
  }
  return <form className={error? "fact-form ahashakeheartache": "fact-form"} onSubmit={handleSubmit}>
  <input type="text" placeholder="Share a fact with the world ❤️..." value={text} onChange={handleText}disabled={isUploading}/>
  <span>{200 - len}</span>
  <input type="text" placeholder="source url" value={source} onChange={handleSource} disabled={isUploading}/>
  <select value={category} onChange={handleCategory}disabled={isUploading} >
  <option value="">Choose Category</option>
    {CATEGORIES.map((cat) =>{
      return <option key = {cat.name} value={cat.name}>{cat.name}</option>
    })}
    
  </select>
  <button className="btn btn-large" disabled={isUploading}>Post</button>
</form>;
}
function CategoryFilter({setCurrentCategory}) {
  return (
    <aside>
      <ul>
        <li className="Category">
          <button className="btn btn-all-category" onClick={() =>{setCurrentCategory('all')}}>All</button>
        </li>
        {CATEGORIES.map((category) => {
          return (
            <li key={category.name} className="Category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: category.color }} onClick={() =>{setCurrentCategory(category.name)}}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
function FactList({facts, setFacts}) {
  if(facts.length === 0){
    return <p className="message">No facts for this category yet! Create your First One✍️</p>
  }
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => {
          return <Fact key={fact.id} fact={fact} setFacts={setFacts}/>;
        })}
      </ul>
    </section>
  );
}

function Fact({ fact , setFacts}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.like + fact.mindblowing < fact.incorrect; 
  async function handleVote(vote){
    setIsUpdating(true);
    const {data: updatedfact, error} = await supabase.from("facts").update({[vote]: fact[vote] + 1}).eq("id", fact.id).select();
    console.log(updatedfact);
    if(!error){
      setFacts((facts) =>facts.map((f) =>{return (f.id === fact.id) ? updatedfact[0]: f}))
    }
  }
  return (
    <li className="fact">
      <p>
        {isDisputed? <span className="disputed">[🚫Disputed]</span>: null}
        {fact.fact}
        <a className="source" href={fact.source} target="blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => {
            return cat.name === fact.category;
          }).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() =>{handleVote("like")}} disabled={isUpdating}>👍🏻 {fact.like}</button>
        <button onClick = {() =>{handleVote("mindblowing")}} disabled={isUpdating}>🤯 {fact.mindblowing}</button>
        <button onClick={() =>{handleVote("incorrect")}} disabled={isUpdating}>❌ {fact.incorrect}</button>
      </div>
    </li>
  );
}
export default App;
