# 🏠 House Construction Expense Tracker

A simple and elegant web application to track and manage house construction expenses. Store expenses by room, category, and payment method with a clean, responsive interface.

## Features

✨ **Core Features:**
- ➕ Add new expenses with room, category, item details
- 📊 Track quantity, cost, and payment method
- 📅 Record expense dates
- 📋 View all expenses in an organized table
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 🔍 Filter expenses by room
- 📥 Export expenses to CSV
- 📈 Summary cards showing total expenses per room

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Modern responsive CSS with gradient UI

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhilashs-bot/family.git
   cd family
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

4. **For development (with auto-reload)**
   ```bash
   npm run dev
   ```

## Usage

### Adding an Expense

1. Fill in the form with:
   - **Room**: e.g., Kitchen, Bedroom, Bathroom
   - **Category**: Select from predefined categories (Flooring, Painting, Electrical, etc.)
   - **Item**: Description of the item (e.g., "Ceramic Tiles")
   - **Quantity**: Number of units
   - **Cost per Unit**: Price in rupees
   - **Mode of Payment**: Cash, Card, Bank Transfer, etc.
   - **Date**: When the expense occurred

2. Click "Add Expense" button

### Viewing Expenses

- **Summary Cards**: See total expenses for each room at a glance
- **Table View**: Complete list of all expenses with details
- **Grand Total**: See the total expenses across all rooms

### Managing Expenses

- **Filter**: Use the "Filter by Room" field to narrow down expenses
- **Edit**: Click the "Edit" button to modify an expense
- **Delete**: Click the "Delete" button to remove an expense
- **Export**: Download all expenses as a CSV file

## Project Structure

```
.
├── server.js              # Express server & API endpoints
├── package.json           # Dependencies
├── public/
│   ├── index.html        # Main HTML interface
│   ├── styles.css        # Responsive styling
│   └── script.js         # Frontend JavaScript
├── expenses.db           # SQLite database (auto-created)
└── README.md            # This file
```

## API Endpoints

### GET /api/expenses
Get all expenses
```
Response: Array of expense objects
```

### GET /api/expenses/room/:room
Get expenses by room
```
Response: Array of expense objects for specified room
```

### POST /api/expenses
Add a new expense
```
Body: {
  room: string,
  category: string,
  item: string,
  qty: number,
  cost: number,
  mode_of_payment: string,
  date: string (YYYY-MM-DD)
}
Response: { id: number, message: string }
```

### PUT /api/expenses/:id
Update an expense
```
Body: { room, category, item, qty, cost, mode_of_payment, date }
Response: { message: string }
```

### DELETE /api/expenses/:id
Delete an expense
```
Response: { message: string }
```

### GET /api/summary
Get summary statistics by room
```
Response: Array of { room, total_cost, item_count }
```

## Features Breakdown

### 1. Expense Categories
- Flooring
- Painting
- Electrical
- Plumbing
- Fixtures & Fittings
- Tiles & Stones
- Doors & Windows
- Labor
- Material
- Other

### 2. Payment Modes
- Cash
- Debit Card
- Credit Card
- Bank Transfer
- Cheque
- UPI

### 3. Data Validation
- All fields are required
- Quantity and cost must be positive numbers
- Date format validation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Future Enhancements

- 📊 Advanced analytics and charts
- 👥 Multi-user support
- 💾 Cloud backup
- 📱 Mobile app
- 🔔 Budget alerts
- 📄 PDF reports
- 📧 Email reports
- 🌙 Dark mode

## Troubleshooting

### Port already in use
If port 3000 is already in use, modify the PORT in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change 3001 to desired port
```

### Database errors
- Delete `expenses.db` file to reset the database
- Restart the server

### CORS errors
Make sure the server is running before loading the frontend

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or feature requests, please create an issue on GitHub.

---

**Happy tracking! 🏗️**
