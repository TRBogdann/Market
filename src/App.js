
import LogInForm from './pages/LogInForm';
import SignUpForm from './pages/SignUpForm';
import Home from './pages/Home';

function App() {

  let currentPage;
  switch(window.location.pathname)
  {
    case "/":
      currentPage=<Home/>;
      break;

    case "/signup":
      currentPage=<SignUpForm/>
      break;
    
   case "/login":
    currentPage=<LogInForm/>
      break;

    default:
      currentPage=<Home/>;
  }
  return (
    <>
    {currentPage}
    </>
  );
}

export default App;
