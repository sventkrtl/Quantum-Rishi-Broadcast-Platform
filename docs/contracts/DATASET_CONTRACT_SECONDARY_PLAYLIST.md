# 📄 DATASET CONTRACT: Secondary Playlist (Continuous Crawl)

**Contract Document**: `docs/contracts/DATASET_CONTRACT_SECONDARY_PLAYLIST.md`  
**Status**: APPROVED & LOCKED (Phase 0 Freeze) 🔒  
**Sprint**: 0.3 — Reference Feature Package  

---

## 🎯 Purpose

This contract defines the strict schema, column mappings, validation rules, and output payload for consuming Google Sheet datasets within the **Secondary Playlist Feature Package** (`features/secondary-playlist/`).

Following **Rule 3 (Consumer Architecture)** and **Rule 4 (Platform Event Ownership)**:
- `GoogleSheetService` fetches and emits raw CSV rows via `platform.sheet.updated`.
- `SecondaryPlaylistConsumer` receives the platform event, validates rows against this contract, and maps them to internal `SecondaryPlaylistItem` objects.

---

## 📊 Google Sheet CSV Column Specification

| Column Header | Type | Required | Default Value | Description |
|---|---|---|---|---|
| `news` / `headline` / `text` | String | **YES** | — | Main news text content displayed in the continuous crawl. |
| `category` / `label` / `badge` | String | No | `"TELANGANA"` | Category badge label (e.g., `"తాజా వార్తలు"`, `"BREAKING"`, `"SPORTS"`). |
| `id` / `item_id` | String | No | Generated UUID | Unique item identifier. |
| `priority` | Integer | No | `1` | Display priority weighting (higher number = higher priority). |
| `theme` | String | No | `"default"` | Theme key (`"default"`, `"breaking"`, `"gold"`, `"sports"`). |
| `status` / `active` | String/Boolean | No | `"active"` | Item status. Values `"false"`, `"0"`, `"draft"`, or `"inactive"` will filter the item out. |

---

## 🛠️ Internal Data Interface (TypeScript / JSDoc)

```typescript
interface SecondaryPlaylistItem {
  /** Unique ID */
  id: string;
  /** Cleaned news text string */
  text: string;
  /** Badge label text */
  category: string;
  /** Priority score (default: 1) */
  priority: number;
  /** Theme styling key */
  theme: string;
  /** Active state boolean */
  active: boolean;
  /** Original CSV row index */
  rowIndex: number;
}

interface SecondaryPlaylistDataset {
  /** Version stamp from platform dataset */
  datasetVersion: number;
  /** Last refresh timestamp ISO string */
  lastRefreshTime: string;
  /** Total items parsed from CSV */
  totalRows: number;
  /** Total valid active items available for crawl loop */
  activeCount: number;
  /** Array of parsed items */
  items: SecondaryPlaylistItem[];
}
```

---

## 🛡️ Validation & Normalization Rules

1. **Required Text Enforcement**:
   - Rows where `news` (or `headline` / `text`) is missing, empty, or whitespace-only MUST be discarded.
2. **Whitespace Normalization**:
   - All string fields are trimmed. Multiple spaces inside text are collapsed to single spaces.
3. **Active Status Filter**:
   - Items with `status` matching `false`, `0`, `inactive`, or `draft` are excluded from the active crawl queue.
4. **Header Alias Support**:
   - To support flexible sheet creators, headers are matched case-insensitively using alias lists:
     - Text aliases: `['news', 'headline', 'text', 'title', 'content']`
     - Category aliases: `['category', 'label', 'badge', 'type']`
     - Priority aliases: `['priority', 'order', 'rank']`
     - Status aliases: `['status', 'active', 'state', 'enabled']`
5. **Item Separation**:
   - As per **Rule 9 (Logo Separator Loop)**, items are rendered in continuous loop separated by the channel logo:
     `Item 1 ──► [LOGO] ──► Item 2 ──► [LOGO] ──► Item 3 ──► [LOGO]`

---

## 🔒 Contract Freeze Authorization

This contract is frozen under **Phase 0 (Secondary Playlist Contract Freeze)** of Sprint 0.3.  
Implementation in Phase 1 and Phase 2 must conform 100% to this contract.
