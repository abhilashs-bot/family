const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./expenses.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room TEXT NOT NULL,
      category TEXT NOT NULL,
      item TEXT NOT NULL,
      qty INTEGER NOT NULL,
      cost REAL NOT NULL,
      mode_of_payment TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database table ready');
    }
  });
}

// API Routes

// Get all expenses
app.get('/api/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get expenses by room
app.get('/api/expenses/room/:room', (req, res) => {
  const room = req.params.room;
  db.all('SELECT * FROM expenses WHERE room = ? ORDER BY date DESC', [room], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add new expense
app.post('/api/expenses', (req, res) => {
  const { room, category, item, qty, cost, mode_of_payment, date } = req.body;

  if (!room || !category || !item || qty === undefined || !cost || !mode_of_payment || !date) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(
    'INSERT INTO expenses (room, category, item, qty, cost, mode_of_payment, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [room, category, item, qty, cost, mode_of_payment, date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Expense added successfully' });
      }
    }
  );
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
  const id = req.params.id;
  const { room, category, item, qty, cost, mode_of_payment, date } = req.body;

  db.run(
    'UPDATE expenses SET room = ?, category = ?, item = ?, qty = ?, cost = ?, mode_of_payment = ?, date = ? WHERE id = ?',
    [room, category, item, qty, cost, mode_of_payment, date, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Expense updated successfully' });
      }
    }
  );
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Expense deleted successfully' });
    }
  });
});

// Get summary statistics
app.get('/api/summary', (req, res) => {
  db.all(`
    SELECT 
      room,
      SUM(cost * qty) as total_cost,
      COUNT(*) as item_count
    FROM expenses
    GROUP BY room
    ORDER BY total_cost DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});