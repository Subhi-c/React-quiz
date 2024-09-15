import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Loader from "./components/Loader";
import Error from "./components/Error";
import ReadyState from "./components/ReadyState";
import Question from "./components/Question";
const initialState = {
  questions: [],
  status: 'loading', //loading, error, ready, active, finished
  index: 0
};
function reducer(state, action){
  switch(action.type){
    case 'dataReceived': 
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      };
    case 'dataFailed':
      return{
        ...state,
        status: "error"
      }
    case 'start':
      return{
        ...state,
        status: "active"
      }
    default: 
      throw new Error("Action unknown");
  }
}
function App() {
  const[{questions,status,index}, dispatch] = useReducer(reducer,initialState);
  const numQuestions = questions.length;
  useEffect(function(){
    fetch('http://localhost:9000/questions')
    .then((res) => res.json())
    .then(data => dispatch({type : 'dataReceived', payload: data}))
    .catch((err) => dispatch({type : 'dataFailed'}));
  },[])
  return (
    <div className="app">
      <Header />
      <Hero>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <ReadyState numQuestions={numQuestions} dispatch={dispatch}/>}
        {status === 'active' && <Question question={questions[index]}/>}
      </Hero>
    </div>
  );
}

export default App;
