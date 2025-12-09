# 🎯 Fake API Setup - JSON Server

This project uses **JSON Server** to provide a mock REST API with realistic collectibles data (Pokémon cards and rare coins).

## 🚀 Quick Start

### 1. Start the Mock API Server

```bash
npm run api
```

This will start JSON Server on **http://localhost:3001**

### 2. Start the Frontend (in another terminal)

```bash
npx nx serve main
```

The frontend will run on **http://localhost:4200** and automatically connect to the mock API.

## 📡 Available Endpoints

| Endpoint                                    | Description             | Example                           |
| ------------------------------------------- | ----------------------- | --------------------------------- |
| `GET /items` (alias: `/assets`)             | List all collectibles   | http://localhost:3001/items       |
| `GET /collections`                          | List all collections    | http://localhost:3001/collections |
| `GET /bundles`                              | List all bundles        | http://localhost:3001/bundles     |
| `GET /items?slug=charizard-1st-edition`     | Get specific item       | -                                 |
| `GET /collections?slug=pokemon-1st-edition` | Get specific collection | -                                 |

## 📦 Mock Data Overview

### Assets (8 items)

- 4 Pokémon cards (Charizard, Blastoise, Pikachu Illustrator, Mewtwo)
- 4 rare coins (1909-S VDB Lincoln, Morgan Dollars, Julius Caesar Denarius)

### Collections (2 groups)

- Pokémon 1st Edition Base Set
- Rare Coins Collection

### Bundles (2 lots)

- Lote de Cartas Pokémon Holo (3 items)
- Colección Morgan Silver Dollars (2 items)

## 🔧 Configuration

### Environment Variables

The API URL is configured in `.env.development.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Data Structure

All data is stored in `db.json` with the following structure:

```json
{
  "assets": {
    "paginate": { "count": 8, "limit": 50, "offset": 0 },
    "records": [...]
  },
  "collections": {
    "paginate": { "count": 2, "limit": 50, "offset": 0 },
    "records": [...]
  },
  "bundles": {
    "paginate": { "count": 2, "limit": 50, "offset": 0 },
    "records": [...]
  }
}
```

## 🎨 Features

✅ Realistic collectible data (Pokémon cards & coins)
✅ Working image URLs from public sources
✅ Price information and billing types (fixed/auction)
✅ Categories: "Pokémon TCG" and "Monedas Antiguas"
✅ Full metadata (descriptions, tags, slugs)
✅ Pagination support

## 📝 Notes

- JSON Server automatically creates REST endpoints from the JSON file
- Data persists in `db.json` - changes are saved automatically
- The API supports full CRUD operations (GET, POST, PUT, DELETE)
- No authentication required for development

## 🛠️ Troubleshooting

**Port 3001 already in use?**

```bash
# Kill the process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Items not showing on frontend?**

- Make sure the API server is running (`npm run api`)
- Check that `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.development.local`
- Verify the API is accessible: http://localhost:3001/items (or /assets)

**Need to reset data?**

- The original data is in `db.json`
- Any changes made through the API are persisted
- To reset, restore `db.json` from this documentation or git
