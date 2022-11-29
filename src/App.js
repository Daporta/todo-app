import './App.css';
import Sun from './images/icon-sun.svg';
import Moon from './images/icon-moon.svg';
import Cross from './images/icon-cross.svg'
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';


function App() { 

  // Handle localStorage
  let parseList = JSON.parse(localStorage.getItem('list'))
  const [list, setList] = useState(parseList || [
    {
      id: 1,
      todo: 'Complete online JavaScript Course',
      condition: 'pending'
    }, 
    {
      id: 2,
      todo: 'Jog around the park x3',
      condition: 'pending'
    }, 
    {
      id: 3,
      todo: '10 minutes meditation',
      condition: 'pending'
    }, 
    {
      id: 4,
      todo: 'Read for 1 hour',
      condition: 'completed'
    }, 
    {
      id: 5,
      todo: 'Pick up groceries',
      condition: 'completed'
    }, 
    {
      id: 6,
      todo: 'Complete Todo App on Frontend Mentor',
      condition: 'pending'
    }
  ]);

  useEffect(() => {
    let stringifyList = JSON.stringify(list)
    localStorage.setItem('list', stringifyList);
  }, [list]);

  let parseSortedList = JSON.parse(localStorage.getItem('sortedList'))
  const [sortedList, setSortedList] = useState(parseSortedList || list);

  useEffect(() => {
    let stringifySortedList = JSON.stringify(sortedList)
    localStorage.setItem('sortedList', stringifySortedList)
  }, [sortedList])

  const [theme, setTheme] = useState(localStorage.getItem('theme') ||'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [sort, setSort] = useState(localStorage.getItem('sort') || 'all');

  useEffect(() => {
    localStorage.setItem('sort', sort)
  }, [sort])

  // Handle theme
  const toggleTheme = () => {
    theme === 'light'
      ? setTheme('dark')
      : setTheme('light')
  };

  //  Handle filtering
  const filterAll = () => {
    setSort('all')
    setSortedList(list);
  };

  const filterPending = () => {
    setSort('pending');
    setSortedList(list.filter(todo => todo.condition === 'pending'));
  };

  const filterCompleted = () => {
    setSort('completed');
    setSortedList(list.filter(todo => todo.condition === 'completed'));
  };

  // Add new item
  const addItem = (e) => {
    if(e.key === 'Enter') {
      const idCreated = Math.floor(Math.random()*1000) + 1;
      const newToDo = e.target.value;
      const newItem = prev => [...prev, {
      id: idCreated,
      todo: newToDo,
      condition: 'pending'
      }] 
      setList(newItem)
    
      setSortedList(newItem)

      e.target.value = ''
    };
  };

  // Toggle item condition
   const toggleCondition = (todo) => {
    setList(
      list.map((item) => {
        if(item.id === todo.id) {
          return item.condition === 'completed' 
            ? {...item, condition: 'pending'}
            : {...item, condition: 'completed'}
        }
        return item;
      }) 
    )
    setSortedList(
      sortedList.map((item) => {
        if(item.id === todo.id) {
          return item.condition === 'completed' 
            ? {...item, condition: 'pending'}
            : {...item, condition: 'completed'}
        }
        return item;
      })
    )  
  }

  // Handle delete 1 item
  const handleDelete = (todo) => {
    setList(list.filter((item) => item.id !== todo.id));
    setSortedList(sortedList.filter((item) => item.id !== todo.id));
  };


  // Handle delete completed items
  const clearCompleted = () => {
    setList(list.filter(todo => todo.condition === 'pending'));
    setSortedList(list);
  }

  // Save reference for dragItem and dragOverItem
  const dragItem =  useRef();
  const dragOverItem = useRef();

  // Handle drag start
  const onDragStart = (e, index) => {
    dragItem.current = index
  }

  // Handle drag enter
  const onDragEnter = (e, index) => {
    dragOverItem.current =index;
  }

  // Handle drag sorting
  const handleDragSort = () => {
    // duplicate items
    let _list = [...sortedList];

    // remove and save the dragged item content
    const draggedItemContent = _list.splice(dragItem.current, 1)[0];

    // Switch the position
    _list.splice(dragOverItem.current, 0, draggedItemContent) 

    // Reset variables
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    setList(_list);
    setSortedList(_list);
  } 

  return (
    <div className={`App App-${theme}`}>
      <header className={`App-header App-header-${theme}`}>
        <div className='header-container'>
          <h1>TODO</h1>
          {(theme === 'light') 
            ? <img 
                src={Moon}
                onClick={toggleTheme} 
                alt="Dark Theme Button" 
              />
            : <img 
                src={Sun}
                onClick={toggleTheme} 
                alt="Light Theme Button" 
              /> }
        </div>

        <section className="input">
          <div className={`input-container input-container-${theme}`}>
            <span className='circle'></span>
            <input 
              className='text-input' 
              type="text" 
              placeholder='Create a new todo...'
              onKeyUp={addItem}
            />
          </div>
        </section>

        <section className={`list list-${theme}`}>
          <div className="list-container">
            <ul className="todo-list">
              {sortedList.map((todo, index) =>{
                return (
                  <div 
                    className="list-item-container"
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragEnter={(e) => onDragEnter(e, index)}
                    onDragEnd ={handleDragSort} 
                    key={todo.id}
                    draggable
                  >
                    <li className={`list-item condition-${todo.condition}`}>
                      <span className='circle' onClick={() => toggleCondition(todo)}></span>
                      <span className="list-text" onClick={() => toggleCondition(todo)}>{todo.todo}</span>
                    </li>
                    <img 
                      className='cross' 
                      src={Cross} 
                      alt="Cross"
                      onClick={() => handleDelete(todo)} 
                    />
                  </div>
                )
              })}
            </ul>
            <div className="buttons-container">
              <span className="items-left">{list.filter( list => list.condition === 'pending').length} items left</span>
              <div className={`sort-buttons-container sort-${sort}`}>
                <button className='all' onClick={filterAll}>All</button>
                <button className='pending' onClick={filterPending}>Active</button>
                <button className='completed' onClick={filterCompleted}>Completed</button>
              </div>
              <div className="clear-button-container" onClick={clearCompleted}>
                <button>Clear Completed</button>
              </div>
            </div>
          </div>
        </section>

        <p className='dragAndDropReminder'>Drag and drop to reorder list</p>
      </header>
    </div>
  );
}

export default App;
