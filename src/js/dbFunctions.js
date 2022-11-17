const addToDoInDb = async todo => {
  try {
    const response = await fetch(`/.netlify/functions/createTodo?todo=${todo}`);

    return await response.json();
  } catch (error) {
    return error;
  }
};

const deleteToDoInDb = async id => {
  try {
    const response = await fetch(`/.netlify/functions/deleteTodo?id=${id}`);

    return response.text();
  } catch (error) {
    return error;
  }
};

const updateToDoInDb = async (id, updatedTodo) => {
  try {
    const response = await fetch(`/.netlify/functions/updateTodo?id=${id}&todo=${updatedTodo}`);

    return response.text();
  } catch (error) {
    return error;
  }
};

export { addToDoInDb, deleteToDoInDb, updateToDoInDb };
