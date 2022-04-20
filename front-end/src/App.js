import './styles/common.css'
import React from 'react'
import io from 'socket.io-client'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ChatroomPage from './pages/ChatroomPage.js'
import LoginPage from './pages/LoginPage.js'
import RegisterPage from './pages/RegisterPage.js'
import IndexPage from './pages/IndexPage.js'
import DashboardPage from './pages/DashboardPage.js'

function App() {
  const [socket, setSocket] = React.useState(null)
  const setupSocket = () => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if (token && !socket) {
      const newSocket = io('http://localhost:8000', {
        query: {
          token: localStorage.getItem('AUTH_TOKEN')
        }
      })

      newSocket.on('disconnect', () => {
        setSocket(null)
      })

      setSocket(newSocket)
    }
  }
  React.useEffect(() => {
    setupSocket()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path='/' component={IndexPage} exact></Route>
          <Route path="/chatroom/:id" render={(props) => <ChatroomPage props={props} socket={socket}></ChatroomPage>} exact></Route>
          <Route path="/register" component={RegisterPage} exact />
          <Route path="/login" render={() => <LoginPage setupSocket={setupSocket}/>} exact />
          <Route path="/dashboard" component={DashboardPage} exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
