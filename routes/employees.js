const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseclient');

router.get('/stats', async (req, res) => {
  const { data: employees, error } = await supabase.from('employees').select('*');
  if (error) return res.status(500).json({ error: error.message });

  const { data: tasks, error: taskError } = await supabase.from('tasks').select('*');
  if (taskError) return res.status(500).json({ error: taskError.message });

  const stats = employees.map(emp => {
    const empTasks = tasks.filter(t => t.assigned_to === emp.id);
    const total = empTasks.length;
    const completed = empTasks.filter(t => t.status.toLowerCase() === 'completed').length;
    const inProgress = empTasks.filter(t => t.status.toLowerCase() === 'in progress').length;
    const overdue = empTasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.due_date < today && t.status.toLowerCase() !== 'completed';
    }).length;

    return {
      ...emp,
      total,
      completed,
      inProgress,
      overdue,
    };
  });

  res.json(stats);
});

module.exports = router;