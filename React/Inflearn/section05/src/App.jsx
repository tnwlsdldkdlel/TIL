import './App.css'
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from './components/Footer'
import Button from './components/Button'

// 부모컴포넌트
function App() {
const buttonProps = {
    text : "이메일",
    color : "red",
}
  return (
    <>
        <Button {... buttonProps}/>
        <Button text={"카페"}/>
        <Button text={"블로그"}>
            <div>자식요소</div>
        </Button>
    </>
  )
}

export default App
