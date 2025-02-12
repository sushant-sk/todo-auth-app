import { useState } from 'react'
import {useCookies  } from 'react-cookie'

const Modal = ({ mode, setShowModal, getData, task }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const editMode = mode === 'edit' ? true : false

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date() //this allows us to use date from the object beging passed through, otherwise create a new date.
  })

  // Add a new todo to the list
  const postData = async e => {
    e.preventDefault() // prevents default refresh of screen which will not allow tasks to be visible on submit
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.status === 200)
      setShowModal(false)
      getData()
    } catch (err) {
      console.error(err)
    }
  }

  // Edit an existing todo
  const editData = async e => {
    e.preventDefault()
    try {
     
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.status === 200){
        setShowModal(false)
        getData() // refresh data
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Update state
  const handleChange = e => {
    
    const { name, value } = e.target //extracts key/value properties from the event
    setData(data => ({
      //updates state using previous state as input parameter
      ...data, //Uses the 'spread' operator to create a new object that uses all the old state.
      [name]: value //updates the existing property with the new state.
    }))
  }

  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3> Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder=' Your task goes here'
            name='title'
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <label for='range'>Drag to select your current progress</label>
          <input
            required
            type='range'
            id='range'
            min='0'
            max='100'
            name='progress'
            value={data.progress}
            onChange={handleChange}
          />

          <input
            className={mode}
            type='submit'
            onClick={editMode ? editData : postData}
          />
        </form>
      </div>
    </div>
  )
}

export default Modal
