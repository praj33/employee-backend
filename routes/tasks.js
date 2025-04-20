const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseclient');

router.post('/tasks', async (req, res) => {
  const { title, status, assigned_to, due_date } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, status, assigned_to, due_date }])
    .select();  // <--- this will return the inserted row

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add task' });
  }

  res.status(201).json(data); // you'll now see task info, not null
});

module.exports = router;
// GET /api/tasks - Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// UPDATE a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, assigned_to, due_date } = req.body;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ title, status, assigned_to, due_date })
      .eq('id', id)
      .select(); // returns the updated row

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});