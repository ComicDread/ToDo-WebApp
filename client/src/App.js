import  './App.css';
import  Task from './components/Task';
import  React from 'react';
import  TaskForm from './components/TaskForm';
import  { useEffect,useState,useRef } from "react";
import  {useQuery,gql,useMutation} from '@apollo/client'
import  { googleLogout } from '@react-oauth/google';
import  { useNavigate } from 'react-router-dom';
import  {ReactComponent as ExpoButton}  from './components/icons/ExpoButton.svg'
import  {ReactComponent as DeleteAll} from './components/icons/DeleteAll.svg'
import  {ReactComponent as FilterButton} from './components/icons/FilterButton.svg'
import  {CSSTransition} from 'react-transition-group'
import  {ReactComponent as AtoZ}  from './components/icons/AtoZ.svg'
import  {ReactComponent as ZtoA} from './components/icons/ZtoA.svg'
import  {ReactComponent as Completed} from './components/icons/Done.svg'
import  {ReactComponent as NotCompleted} from './components/icons/NotDone.svg'
import  {ReactComponent as Logout} from './components/icons/logout.svg'
import  {ReactComponent as GoBack} from './components/icons/GoBack.svg'
import  {ReactComponent as DeleteUser} from './components/icons/DeleteUser.svg'
import  {ReactComponent as Settings} from './components/icons/Settings.svg'
import  {GET_TASKS,ADD_TASK,TASK_DONE,DELETE_TASK,UPDATE_TITLE,DELETE_TASKS,TASK_SORTED,TASK_SORTED_DESC,TASK_SORTED_DONE,TASK_SORTED_NOT_DONE,DELETE_USER,CHECK_USER} from './queries/query';


function App() {
  const currentUserUid = JSON.parse(localStorage.getItem('currentUser'));
  const currentUserName = JSON.parse(localStorage.getItem('currentUserName'));
  const currentUserImg = JSON.parse(localStorage.getItem('currentUserImg'));
  const google = JSON.parse(localStorage.getItem('LoggedWithGoogle'));
  const local = JSON.parse(localStorage.getItem('LoggedWithLocal'));
  const { data: tasksData } = useQuery(GET_TASKS,{    
    variables: {
    Uid: currentUserUid,
    userName: currentUserName
  }
});

  const [getTasksDESC] = useMutation(TASK_SORTED_DESC)
  const [sortedTasks, setSortedTasks] = useState([]);
  const [deleteAllTasksMutation] = useMutation(DELETE_TASKS)
  const [deleteUserMutation] = useMutation(DELETE_USER)
  const [updateTitleMutation] = useMutation(UPDATE_TITLE)
  const [addTaskMutation] = useMutation(ADD_TASK)
  const [deletedTaskMutation] = useMutation(DELETE_TASK)
  const [getTasksDone] = useMutation(TASK_SORTED_DONE)
  const [updateTaskDoneMutation] = useMutation(TASK_DONE)
  const [getTasksNotDone] = useMutation(TASK_SORTED_NOT_DONE)
  const [open, setOpen] = useState(false);
  const tasks = tasksData?.tasks ?? [];
  const numberComplete = tasks.filter(t => t.done).length;
  const numberTotal = tasks.length;
  const [getTasks] = useMutation(TASK_SORTED)
  const navigate = useNavigate();
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('action from user:' + currentUserUid);
  },[tasks]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.dropdown') === null) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function AddTask(taskName) {
    addTaskMutation({
      variables: {
        input: {
          name: taskName
        },
        Uid: currentUserUid,
        userName: currentUserName
      },
      update: (cache, { data }) => {
        const existingTasks = cache.readQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          }
        });
        const newTask = {
          userName: currentUserName,
          Uid: currentUserUid,
          taskName: data.newTask.taskName,
          done: false,
          id: data.newTask.id
        };
        const updatedTasks = [...existingTasks.tasks, newTask];
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: updatedTasks }
        });
      },
    });
  }
  
  function removeTask(index) {
    const taskId = tasksData.tasks[index].id; 
    deletedTaskMutation({
      variables: {
        id: taskId,
        Uid: currentUserUid
      },
      update: (cache) => {
        const existingTasks = cache.readQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          }
        });
        const updatedTasks = existingTasks.tasks.filter((task) => task.id !== taskId);
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: updatedTasks }
        });
      },
    });
  }
  
  function updateTaskDone(index, done) {
    const taskId = tasksData.tasks[index].id;
    updateTaskDoneMutation({
      variables: {
        id: taskId,
        Uid: currentUserUid,
        done:done
      },
      update: (cache) => {
        const existingTasks = cache.readQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          }
        });
        const updatedTasks = existingTasks.tasks.map((task, i) => {
          if (i === index) {
            return { ...task, done };
          }
          return task;
        });
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: updatedTasks }
        });
      }
    });
  }
  
  function renameTasks(index, newName) {
    const taskId = tasksData.tasks[index].id;
    updateTitleMutation({
      variables: {
        id: taskId,
        Uid: currentUserUid,
        input: {
          name: newName
        }
      },
      update: (cache, { data }) => {
        const existingTasks = cache.readQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          }
        });
        const updatedTasks = existingTasks.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, taskName: newName };
          }
          return task;
        });
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: updatedTasks }
        });
      }
    }).catch(error => {
      if (
        error.message.includes('version_conflict_engine_exception') &&
        error.message.includes('version conflict')
      ) {
      } else {
        console.error(error);
      }
    });
  }  

  function getMessage() {
    const percentage = numberTotal === 0 ? 0 : (numberComplete / numberTotal) * 100;
    if (percentage === 0) {
      return 'no tasks complete 😾';
    }
    if (percentage === 100) {
      return 'nice job! 😻';
    }
    return 'keep it up! 😼';
  }

  function handleLogout(){
    googleLogout()
    localStorage.setItem('currentUserImg', JSON.stringify(null));
    localStorage.setItem('currentUserName', JSON.stringify(null));
    localStorage.setItem('currentUser', JSON.stringify(null));
    localStorage.setItem('tasks', JSON.stringify(null));
    localStorage.setItem('LoggedWithLocal', JSON.stringify(false));
    localStorage.setItem('LoggedWithGoogle', JSON.stringify(false));
    navigate('/login');
  }

  function handleExport() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const tasksJson = JSON.stringify(tasks);
    const blob = new Blob([tasksJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";
    link.click();
  }

  async function removeAllTasks() {
    const taskIds = tasksData.tasks.map((task) => task.id);
    await deleteAllTasksMutation({
      variables: {
        Uid: currentUserUid,
        id: taskIds
      },
      update: (cache) => {
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: [] }, 
        });
      },
    });
  }

  async function HandleDeleteAccount(){
    const taskIds = tasksData.tasks.map((task) => task.id);
    const Uid = currentUserUid
    deleteUserMutation({
      variables: {
        Uid: currentUserUid,
        id: taskIds
      },
      update: (cache) => {
        cache.writeQuery({
          query: CHECK_USER,
          variables: {Uid:Uid},
          data: { CheckUser: {} },
        });
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: [] }, 
        });
      },
    })
    localStorage.setItem('currentUser', JSON.stringify(null));
    localStorage.setItem('currentUserName', JSON.stringify(null));
    localStorage.setItem('currentUserImg', JSON.stringify(null));
    localStorage.setItem('LoggedWithLocal', JSON.stringify(false));
    localStorage.setItem('LoggedWithGoogle', JSON.stringify(false));
    navigate('/login')
  }

  function handleSorted() {
    getTasks({
      variables: {
        Uid: currentUserUid,
        userName: currentUserName
      },
      update: (cache, { data }) => {
        const sorted = data.getSortedTasks;
        setSortedTasks(sorted); 
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: sorted }
        });
      }
    })
  }

  function handleSortedDesc() {
    getTasksDESC({
      variables: {
        Uid: currentUserUid,
        userName: currentUserName
      },
      update: (cache, { data }) => {
        const sorted = data.getNonSortedTasks;
        setSortedTasks(sorted);
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: sorted }
        });
      }
    })
  }

  function handleSortedDone() {
    getTasksDone({
      variables: {
        Uid: currentUserUid,
        userName: currentUserName
      },
      update: (cache, { data }) => {
        const sorted = data.getSortedByDone;
        setSortedTasks(sorted); 
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: sorted }
        });
      }
    })
  }

  function handleNotDone() {
    getTasksNotDone({
      variables: {
        Uid: currentUserUid,
        userName: currentUserName
      },
      update: (cache, { data }) => {
        const sorted = data.getSortedByNotDone;
        setSortedTasks(sorted); 
        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            Uid: currentUserUid,
            userName: currentUserName
          },
          data: { tasks: sorted }
        });
      }
    })
  }

  function Navbar(props) {
    return (
      <div>
        <nav className="nav">
          <ul className="nav-nav">{props.children}</ul>
          <p className="user">Ciao {currentUserName}</p>
        </nav>
      </div>
    );
  }
  
  function Navitem(props) {
    return (
      <li className="nav-item">
        <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
          <img src={currentUserImg}  referrerPolicy="no-referrer" className="UserImg" alt="Immagine del profilo" />
          {props.icon}
        </a>
        {open && props.children}
      </li>
    );
  }

  function DropdownMenu() {
    const [activeMenu,setActiveMenu] = useState('main')
    const [menuHeight,setMenuHeight] = useState(null)
    const dropdownRef = useRef(null);

    useEffect(() => {
      setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])
  

    function calcHeight(el) {
      const height = el.offsetHeight;
      setMenuHeight(height);
    }
    
    function DropdownItem(props) {
      const onClick = (event) => {
        event.preventDefault();
        if (props.goToMenu) {
          setActiveMenu(props.goToMenu);
        }
        if (props.onClick) {
          props.onClick();
        }
      };
    
      return (
        <a href="#" className="menu-item" onClick={onClick}>
          <span className="icon-button">{props.leftIcon}</span>
          {props.children}
          <span className="icon-right">{props.rightIcon}</span>
        </a>
      );
    }
    
    
  
    return (
      <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
  
        <CSSTransition
          in={activeMenu === 'main'}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit
          onEnter={calcHeight}>
          <div className="menu">
            <DropdownItem 
              rightIcon={<DeleteAll/>}
              onClick={removeAllTasks}>
              Elimina Tutto
              </DropdownItem>
            <DropdownItem
              rightIcon={<ExpoButton/>}
              onClick={handleExport}>
              Esporta JSON
            </DropdownItem>
            <DropdownItem
              rightIcon={<FilterButton/>}
              goToMenu="filtri">
              Filtra
            </DropdownItem>
            <DropdownItem
              rightIcon={<Settings/>}
              goToMenu="settings">
              Impostazioni
            </DropdownItem>
            <DropdownItem
              rightIcon={<Logout/>}
              onClick={handleLogout}>
              Cambia Account
            </DropdownItem>
  
          </div>
        </CSSTransition>
  
        <CSSTransition
        in={activeMenu === 'filtri'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem
          rightIcon={<AtoZ/>}
          onClick={handleSorted}
          > 
          Da A a Z
          </DropdownItem>
          <DropdownItem
          rightIcon={<ZtoA/>}
          onClick={handleSortedDesc}
          > 
          Da Z a A
          </DropdownItem>
          <DropdownItem
          rightIcon={<Completed/>}
          onClick={handleSortedDone}
          > Completate
          </DropdownItem>
          <DropdownItem
          rightIcon={<NotCompleted/>}
          onClick={handleNotDone}
          > 
          Da completare
          </DropdownItem>
          <DropdownItem 
          goToMenu="main"
          rightIcon={<GoBack/>}>
          Torna indietro
          </DropdownItem>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem
          rightIcon={<DeleteUser/>}
          onClick={HandleDeleteAccount}> 
          Elimina account
          </DropdownItem>
          <DropdownItem 
          goToMenu="main"
          rightIcon={<GoBack/>}>
          Torna indietro
          </DropdownItem>
        </div>
      </CSSTransition>

      </div>
    );
  }
  
//{tasksData && tasksData.tasks && tasksData.tasks.map((task, index) => (
  return (
    <main>
    <Navbar>
      <Navitem>
        <DropdownMenu/>
      </Navitem>
    </Navbar>
      <h1>{numberComplete}/{numberTotal} Complete</h1>
      <h2>{getMessage()}</h2>
      <TaskForm onAdd={AddTask}/>
      <div className="taskContainer">
        {tasks.map((task, index) => (
          <Task
            {...task}
            key={index}
            onRename={newName => renameTasks(index, newName)}
            onTrash={() => removeTask(index)}
            onToggle={done => updateTaskDone(index, done)}
          />
          ))}
    </div>
    </main>
  )
}

export default App;
