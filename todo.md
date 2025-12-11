# CRM Layout & Route Refactor Plan

## ✨ Cleaner Route Structure

**Old routes:**

- `/items/pokemon` → Pokemon cards
- `/items/monedas` → Coins
- `/items/pokemon/pikachu-vmax` → Item detail

**New routes (simplified):**

- `/cartas` → All trading cards
- `/numismatica` → All coins
- `/cartas/pikachu-vmax` → Item detail
- `/numismatica/moneda-balboa-1931` → Item detail

## 🎯 Goals

1. **Route Changes:**

   - `/items/monedas` → `/numismatica`
   - `/items/pokemon` → `/cartas`
   - Individual items: `/numismatica/[slug]` and `/cartas/[slug]`

2. **Layout Changes:**
   - Replace top filter bar with persistent left sidebar
   - Implement Fanatics Collect-style filter system
   - Separate filter sets for cards vs coins

---

## 📋 Phase 1: Route Restructuring (2-3 hours)

### 1.1 Create New Page Files

**Create:** `apps/main/src/pages/numismatica/[[...slug]].tsx`

```
numismatica/
└── [[...slug]].tsx   # Handles /numismatica and /numismatica/[slug]
```

**Create:** `apps/main/src/pages/cartas/[[...slug]].tsx`

```
cartas/
└── [[...slug]].tsx   # Handles /cartas and /cartas/[slug]
```

### 1.2 Update Route Logic

Each new page file should:

1. Check if `slug` array exists → item detail page
2. If no slug → listing page with filters
3. Pass category context (`numismatica` or `cartas`) to components

**Template structure:**

```javascript
// /numismatica/[[...slug]].tsx
export default function NumismaticaPage() {
  const router = useRouter()
  const { slug } = router.query
  const category = 'monedas' // maps to your db.json blockchain field

  // If slug exists, show item detail
  if (slug && slug.length > 0) {
    return <ItemDetail slug={slug[0]} category={category} />
  }

  // Otherwise show listing with sidebar
  return <ItemsListing category={category} type="numismatica" />
}
```

### 1.3 Add Redirects for Old Routes

**Update:** `next.config.js` or `vercel.json`

```json
{
  "redirects": [
    {
      "source": "/items/monedas/:path*",
      "destination": "/numismatica/:path*",
      "permanent": true
    },
    {
      "source": "/items/pokemon/:path*",
      "destination": "/cartas/:path*",
      "permanent": true
    },
    {
      "source": "/items",
      "destination": "/",
      "permanent": false
    }
  ]
}
```

### 1.4 Update Navigation Links

**Files to update:**

- `libs/shared/ui/src/lib/Header/Header.tsx` (main nav)
- `apps/main/src/pages/index.tsx` (homepage links)
- Any component with hardcoded `/items/` routes

**Search for:** `/items/pokemon` and `/items/monedas`
**Replace with:** `/cartas` and `/numismatica`

---

## 📋 Phase 2: Sidebar Component Creation (3-4 hours)

### 2.1 Create Sidebar Component Structure

**Create:** `apps/main/src/components/items/sidebar/ItemsSidebar.tsx`

**Features:**

- Sticky positioning (stays visible on scroll)
- Collapsible sections
- Category-specific filter rendering
- "Reset all" button
- Active filter count badge

### 2.2 Create Filter Components

**Create filter subdirectory:** `components/items/sidebar/filters/`

Individual filter components:

1. **SelectFilter.tsx** - Dropdown select (Category, Authenticator)
2. **CheckboxFilter.tsx** - Multiple selection (Purchase Options, Seller)
3. **RangeFilter.tsx** - From/To inputs (Year, Grade, Price)
4. **BadgeFilter.tsx** - Toggle buttons (Great Deal indicator)

Each filter component should:

- Accept props: `label`, `options`, `value`, `onChange`
- Handle its own state
- Emit changes to parent
- Show active state visually

### 2.3 Create Filter Configuration Files

**Create:** `components/items/sidebar/filterConfigs.js`

```javascript
export const CARDS_FILTERS = {
  purchaseOption: {
    type: 'checkbox',
    label: 'Purchase Option',
    options: [
      { value: 'all', label: 'All' },
      { value: 'allow_offers', label: 'Allow Offers' },
      { value: 'has_offers', label: 'Has Offers' }
    ]
  },
  seller: {
    type: 'checkbox',
    label: 'Seller',
    options: [] // populate from API
  },
  category: {
    type: 'select',
    label: 'Category',
    options: [
      'Baseball',
      'Basketball',
      'Football',
      'Hockey',
      'Pokémon (English)',
      'Pokémon (Japanese)',
      'Pokémon (Other Languages)',
      'Comics',
      'Other'
    ]
  },
  year: {
    type: 'range',
    label: 'Year',
    min: 1900,
    max: new Date().getFullYear()
  },
  authenticator: {
    type: 'select',
    label: 'Authenticator',
    options: ['BGS', 'CGC', 'CSG', 'MBA', 'PSA', 'PSA_DNA', 'SGC']
  },
  grade: {
    type: 'range',
    label: 'Grade',
    min: 1,
    max: 10
  },
  price: {
    type: 'range',
    label: 'Price',
    min: 0,
    max: 100000
  }
}

export const COINS_FILTERS = {
  purchaseOption: {
    /* same as cards */
  },
  seller: {
    /* same as cards */
  },
  coinType: {
    type: 'select',
    label: 'Coin Type',
    options: ['Gold', 'Silver', 'Copper', 'Commemorative', 'Ancient']
  },
  country: {
    type: 'select',
    label: 'Country',
    options: [] // populate from your data
  },
  year: {
    /* same as cards */
  },
  grade: {
    /* same as cards */
  },
  price: {
    /* same as cards */
  }
}
```

---

## 📋 Phase 3: Layout & Integration (2-3 hours)

### 3.1 Create New Items Listing Layout

**Create:** `components/items/ItemsListingLayout.tsx`

```jsx
<div className="flex min-h-screen">
  {/* Sidebar - Fixed width */}
  <aside className="sticky top-0 h-screen w-72 overflow-y-auto border-r bg-white">
    <ItemsSidebar
      type={type}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  </aside>

  {/* Main Content Area */}
  <main className="flex-1 p-6">
    {/* Results Header */}
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{resultCount}+ Results</h1>
      <SortDropdown value={sort} onChange={setSort} />
    </div>

    {/* Active Filters Tags */}
    <ActiveFilters filters={filters} onRemove={handleRemoveFilter} />

    {/* Items Grid */}
    <ItemsGrid items={items} />

    {/* Infinite Scroll Trigger */}
    <InfinityLoadChecker onLoadMore={loadMore} />
  </main>
</div>
```

### 3.2 Update Items Page Files

**Update both:**

- `/numismatica/[[...slug]].tsx`
- `/cartas/[[...slug]].tsx`

Replace current filter bar logic with new sidebar layout:

```javascript
// Remove old filterBar import
- import FilterBar from 'components/common/filterBar';

// Add new imports
+ import ItemsListingLayout from 'components/items/ItemsListingLayout';
+ import { CARDS_FILTERS, COINS_FILTERS } from 'components/items/sidebar/filterConfigs';
```

### 3.3 Filter State Management

**Create:** `hooks/useItemFilters.js`

```javascript
export const useItemFilters = (initialCategory) => {
  const [filters, setFilters] = useState({
    category: initialCategory,
    purchaseOption: [],
    seller: [],
    year: { from: null, to: null },
    price: { from: null, to: null }
    // ... more filters
  })

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ category: initialCategory })
  }

  const activeFilterCount = useMemo(() => {
    // Calculate how many filters are active
  }, [filters])

  return { filters, updateFilter, resetFilters, activeFilterCount }
}
```

---

## 📋 Phase 4: API & Data Updates (1-2 hours)

### 4.1 Update API Routes

**Modify:** `apps/main/src/pages/api/assets.ts`

Add support for new filter parameters:

```javascript
export default function handler(req, res) {
  const {
    blockchain, // your category field
    year_from,
    year_to,
    grade_from,
    grade_to,
    price_from,
    price_to,
    authenticator,
    seller
  } = req.query

  let filtered = db.assets

  // Apply category filter
  if (blockchain) {
    filtered = filtered.filter((item) => item.blockchain === blockchain)
  }

  // Apply range filters
  if (price_from) {
    filtered = filtered.filter((item) => item.price >= Number(price_from))
  }
  // ... more filters

  res.json(filtered)
}
```

### 4.2 Update getAssets Callback

**Modify:** `libs/shared/api/src/lib/callbacks/getAssets.ts`

Accept new filter parameters:

```javascript
export const getAssets = async (params = {}) => {
  const queryParams = new URLSearchParams()

  // Convert filter object to query params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value)
    }
  })

  const response = await api.get(`/assets?${queryParams.toString()}`)
  return response.data
}
```

### 4.3 Extend db.json Data Model

**Update:** `apps/main/db.json`

Add new fields to your assets:

```json
{
  "assets": [
    {
      "token": "1",
      "name": "Pikachu VMAX",
      "blockchain": "Pokemon TCG",
      "price": 150.0,
      "billing_type": "fixed_price",

      // NEW FIELDS
      "year": 2021,
      "authenticator": "PSA",
      "grade": 10,
      "seller": "Cards HQ",
      "subcategory": "Pokémon (English)",
      "card_number": "044/185"
    }
  ]
}
```

---

## 📋 Phase 5: Styling & Responsiveness (2-3 hours)

### 5.1 Sidebar Styles

**Create:** `components/items/sidebar/sidebar.module.css` (or use Tailwind)

Key styling considerations:

```css
.sidebar {
  width: 288px; /* 18rem / w-72 */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  background: white;
}

.filterSection {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.filterSection h3 {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
  color: #374151;
}
```

### 5.2 Mobile Responsiveness

Add mobile drawer for filters:

- Hide sidebar on mobile (`md:block hidden`)
- Add "Filter" button in header (mobile only)
- Implement slide-out drawer using Headless UI Dialog
- Show filter count badge on mobile button

**Component:** `components/items/sidebar/MobileFilterDrawer.tsx`

### 5.3 Active Filter Chips

**Create:** `components/items/ActiveFilters.tsx`

Display active filters as removable chips:

```jsx
<div className="mb-4 flex flex-wrap gap-2">
  {filters.year.from && (
    <Chip onRemove={() => removeFilter('year', 'from')}>
      Year: {filters.year.from}+
    </Chip>
  )}
  {/* More filter chips */}
</div>
```

---

## 📋 Phase 6: Testing & Refinement (1-2 hours)

### 6.1 Testing Checklist

- [ ] All old routes redirect correctly
- [ ] Both `/numismatica` and `/cartas` listing pages load
- [ ] Individual item pages work: `/cartas/pikachu-vmax`
- [ ] Filters update URL query params
- [ ] Filters persist on page refresh
- [ ] "Reset all" clears all filters
- [ ] Active filter count is accurate
- [ ] Infinite scroll works with filters
- [ ] Mobile filter drawer opens/closes
- [ ] Responsive layout on tablet/mobile
- [ ] Filter combinations work correctly

### 6.2 Update Homepage

**Modify:** `apps/main/src/pages/index.tsx`

Update category links in hero/preview sections:

```jsx
<Link href="/cartas">
  Ver Cartas Pokémon
</Link>

<Link href="/numismatica">
  Ver Monedas
</Link>
```

### 6.3 Cleanup Old Code

**Remove:**

- `components/common/filterBar/` (old filter system)
- `/items/[[...path]].tsx` (if no longer needed)
- Unused filter logic in old pages

---

## 🎨 Design Specifications

### Sidebar Dimensions

- Width: `288px` (w-72)
- Background: White
- Border: `1px solid #e5e7eb` (gray-200)
- Position: Sticky, top: 0
- Max height: 100vh with scroll

### Filter Sections

- Padding: `16px` (p-4)
- Section divider: `1px solid #f3f4f6` (gray-100)
- Section title: Font 14px, weight 600, color gray-700

### Filter Controls

- Checkbox size: 18px
- Input height: 40px
- Border radius: 6px
- Focus ring: 2px blue-500

### Active Filters

- Chip background: gray-100
- Chip border-radius: 9999px (full)
- X button: hover background gray-200

---

## 📦 Dependencies (if needed)

You likely already have these, but confirm:

```json
{
  "@headlessui/react": "^1.7.0", // For mobile drawer
  "framer-motion": "^10.0.0", // Already using
  "react-icons": "^4.10.0" // For filter icons
}
```

---

## 🚀 Implementation Order

### Week 1: Routes & Structure

1. ✅ Create new page files (`/numismatica`, `/cartas`)
2. ✅ Add redirects from old routes
3. ✅ Update all navigation links
4. ✅ Test routing works

### Week 2: Sidebar Development

5. ✅ Create sidebar component structure
6. ✅ Build individual filter components
7. ✅ Create filter configuration files
8. ✅ Implement filter state management

### Week 3: Integration & Styling

9. ✅ Integrate sidebar into pages
10. ✅ Update API to handle new filters
11. ✅ Style sidebar & filters
12. ✅ Add mobile responsiveness

### Week 4: Polish & Testing

13. ✅ Add active filter chips
14. ✅ Implement "Reset all" functionality
15. ✅ Test all filter combinations
16. ✅ Cleanup old code

---

## 💡 Pro Tips

1. **Start with one route first** - Build `/cartas` completely before duplicating to `/numismatica`

2. **Keep filter logic reusable** - Use the same components for both categories, just swap the config

3. **URL query params** - Store filter state in URL so users can bookmark filtered views:

   ```
   /cartas?year_from=2020&grade=10&authenticator=PSA
   ```

4. **Performance** - Only fetch new data when filters actually change, not on every keystroke

5. **Debounce text inputs** - For price range inputs, wait 500ms after user stops typing

6. **Progressive enhancement** - Sidebar filters work without JS by using forms + query params
