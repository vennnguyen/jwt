import {BrowserRouter, Route, Routes} from "react-router"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Home from "./pages/Home"
import {Toaster} from "sonner"

function App() {
  return <>
  <Toaster richColors/>
  <BrowserRouter>
  {/* public routes */}
  <Routes>
      <Route path="/sign-in" element={<SignInPage/>}/>
      <Route path="/sign-up" element={<SignUpPage/>}/> 
       {/* protected routes */}
  <Route path="/" element={<Home/>}/>
  </Routes>

  </BrowserRouter>
  </>
}

export default App
