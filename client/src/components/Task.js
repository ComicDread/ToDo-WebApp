import React, { useState, useEffect, useRef } from "react";
import Checkbox from "./Checkbox";

export default function Task({ taskName, done, onToggle, onTrash, onRename }) {
  const [editMode, setEditMode] = useState(false);
  const taskNameRef = useRef(null);

  const handleClick = () => !done && setEditMode(true);
  const handleBlur = () => setEditMode(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const { target } = event;
      const isInsideTask = target.classList.contains("task");
      const isInsideInput = target.tagName === "INPUT";

      if (!isInsideTask && !isInsideInput) {
        setEditMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editMode]);

  return (
    <div className={`task ${done ? "done" : ""}`}>
      <Checkbox checked={done} onClick={() => onToggle(!done)} />
      {!editMode ? (
        <div className="taskName" onClick={handleClick}>
          <span ref={taskNameRef}>{taskName}</span>
        </div>
      ) : (
        <form onSubmit={(ev) => { ev.preventDefault(); setEditMode(false) }}>
          <input
            type="text"
            value={taskName}
            onChange={(ev) => onRename(ev.target.value)}
            onBlur={handleBlur}
          />
        </form>
      )}
      <button className="trash" onClick={onTrash}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    </div>
  );
}
