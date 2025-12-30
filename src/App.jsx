import { useState } from 'react'
import styles from './App.module.css'

function App() {

  const [columns, setColumns] = useState({
    todo: {
      name:"To Do",
      items: [
        {id: "1", content:"Market Research"},
        {id: "2", content:"Write Projects"}
      ]
    },
    inProgress:{
      name:"In Progress",
      items: [
        {id: "3", content:"Design UI mockups"},
      ]
    },
    done:{
      name: "Done",
      items: [
        {id:"4", content:"Set up repository"}
      ]
    }
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);


  const addNewTask = () => {
    if(newTask.trim() === "") return;

    const updatedColumns = {...columns};

    updatedColumns[activeColumns].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updatedColumns);
    setNewTask("");
  };

  const removeTask = (columnId, taskId) => {
    const updatedColumns = {...columns};

    updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId);
    setColumns(updatedColumns);
  }

  const handleDragStart = (columnId, item) => {
    setDraggedItem({columnId, item})
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault();

    if(!draggedItem) return;

    const {columnId: sourceColumnId, item } = draggedItem;

    if(sourceColumnId === columnId) return;

    const updateColumns = {...columns};

    updateColumns[sourceColumnId].items = updateColumns[sourceColumnId].items.filter((i) => i.id != item.id);

    updateColumns[columnId].items.push(item);
    setColumns(updateColumns);
    setDraggedItem(null);

  }

  const columnStyles = {
    todo: {
      header: styles.columnHeaderTodo,
      border: styles.columnTodo,
    },
    inProgress: {
      header: styles.columnHeaderInProgress,
      border: styles.columnInProgress,
    },
    done: {
      header: styles.columnHeaderDone,
      border: styles.columnDone,
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>React Kanban Board</h1>

        <div className={styles.inputSection}>
          <input 
            type='text' 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Add a new task...'
            className={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && addNewTask()}
          />

          <select 
            value={activeColumns}
            onChange={(e) => setActiveColumns(e.target.value)}
            className={styles.select}
          >
            {Object.keys(columns).map((columnId) => (
              <option value={columnId} key={columnId}>
                {columns[columnId].name}
              </option>
            ))}
          </select>
          <button 
            onClick={addNewTask}
            className={styles.addButton}
          >
            Add
          </button>
        </div>
        <div className={styles.columnsContainer}>
          {Object.keys(columns).map((columnId) => (
            <div 
              key={columnId}
              className={`${styles.column} ${columnStyles[columnId].border}`}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className={`${styles.columnHeader} ${columnStyles[columnId].header}`}> 
                {columns[columnId].name}
                <span className={styles.badge}>
                  {columns[columnId].items.length}
                </span>
              </div>
              <div className={styles.columnContent}>
                {columns[columnId].items.length === 0 ? (
                  <div className={styles.emptyColumn}>Drop tasks here</div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div 
                      key={item.id} 
                      className={styles.taskItem}
                      draggable 
                      onDragStart={() => handleDragStart(columnId, item)}
                    >
                      <span className={styles.taskContent}>{item.content}</span>
                      <button 
                        onClick={() => removeTask(columnId, item.id)} 
                        className={styles.deleteButton}
                      >
                        <span className={styles.deleteIcon}>X</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>    
  )
}

export default App
