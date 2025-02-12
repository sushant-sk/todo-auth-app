
import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import {useEffect, useState} from 'react'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.email
  const authToken = cookies.AuthToken
  const [tasks, setTasks] = useState(null)

  const getData = async () => {
    
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
        const json = await response.json()
        setTasks(json)
    } catch (e) {
      console.error(e);
    }
  }

  //only get data if there is an authorized user
  useEffect(() =>{
    if (authToken) 
    {
      getData()
    }
  }, [])

  //Sort tasks by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date (b.date)) 
 
  //if cookie not set, show the Auth Modal, otherwise get and show the list of items in the users database via their email.
  return (
    <div className="app">
   
   {!authToken && <Auth/>} 
   {authToken && 
   <>
      <ListHeader listName={'🏖️ Holiday tick list'} getData={getData}/>
      <p className="user-email"> Welcome Back {userEmail}</p>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task={task} getData={getData}/>)}
      </>}
      <p className='copyright'>© Richardson Designs, LLC</p>
    </div>
  )
}
export default App;
  
