import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

interface Users {
  id: number;
  name: string;
  username: string
}

function App() {
  const [users, setUsers] = useState<Users[]>([]);
  const [queryID, setQueryID] = useState<number>(0);
  const [queryName, setQueryName] = useState<string>('');
  const [queryUsername, setQueryUsername] = useState<string>('');

  const clearQueries = () => {
    setQueryID(0);
    setQueryName('');
    setQueryUsername('');
  }

  const createUser = async () => {
    if (!queryName || !queryUsername) {
      toast.error("Must enter a name and username to create user");
      return
    }
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', {
        name: queryName,
        username: queryUsername
      });
      const newUser = response.data;
      const allUsers = [...users, newUser].map((user, i) => ({
        ...user,
        id: i + 1
      }))
      setUsers(allUsers);
      clearQueries();
    } catch (error) {
      console.log("There was an error creating a user", error);
    }
  }

  const getUsers = async () => {
    try {
      const data: Users[] = (await axios.get('https://jsonplaceholder.typicode.com/users')).data;
      const allUsers: Users[] = data.map((user: Users) => ({
        id: user.id,
        name: user.name,
        username: user.username
      }))
      setUsers(allUsers)
    } catch (error) {
      console.log("There was an error obtaining users", error);
    }
  }

  const updateUser = async () => {
    if (!queryName || !queryUsername) {
      toast.error("Must enter a name and username to create user");
      return
    }
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${queryID}`, {
        id: queryID,
        name: queryName,
        username: queryUsername
      });
      const updatedUser: Users = response.data
      const allUsers = users.map((user) =>
        user.id === queryID ? updatedUser : user
      );
      setUsers(allUsers)
      clearQueries();
    } catch (error) {
      console.log("There was an error updating this user", error);
      toast.error("There was an error updating the user")
    }
  }

  const deleteUsers = async () => {
    if (!queryID) {
      toast.error("No user selected for deletion");
      return;
    }
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${queryID}`);
      const remainingUsers = users
        .filter((user) => user.id !== queryID)
        .map((user, i) => ({
          ...user,
          id: i + 1
        }))
      setUsers(remainingUsers)
      clearQueries();
    } catch (error) {
      console.log("There was an error deleting the user", error);
      toast.error("Failed to delete user");
    }
  }


  //set state of users on inital render
  useEffect(() => {
    getUsers();
  }, []);

  const handleRowClick = (id: number) => {
    setQueryID(id)
  }

  return (
    <div className="w-screen h-screen bg-main">
      <header className='w-full h-[15vh] flex items-center justify-center'>
        <nav className='w-5/6 h-full flex flex-col items-center justify-evenly'>
          <h1>Usertility</h1>
          <p>Enter details to create, select to and enter details to update, double click to delete</p>
        </nav>
      </header>
      <div className='w-full h-[80vh] flex flex-col items-center justify-between'>
        <div className='w-3/5 h-[10%] flex flex-row items-center justify-evenly'>
          <input type="text" autoComplete='on' name='name' placeholder='Enter Name' value={queryName} onChange={(e) => setQueryName(e.target.value)} />
          <input type="text" autoComplete='on' name='username' placeholder='Enter Username' value={queryUsername} onChange={(e) => setQueryUsername(e.target.value)} />
        </div>
        <div className='w-3/5 h-[70%] border overflow-y-auto bg-secondary flex items-center just'>
          <table className='w-full h-full table-auto'>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>username</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, i) => (
                <tr
                  style={{ backgroundColor: queryID === user.id ? '#fdff32' : '#f8f8f8' }}
                  onClick={() => handleRowClick(user.id)}
                  key={i}
                >
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='w-3/5 h-[10%] flex flex-row items-center justify-between'>
          <button onClick={() => createUser()}>Create</button>
          <button onClick={() => updateUser()}>Update</button>
          <button onClick={() => deleteUsers()}>Delete</button>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
}

export default App;
