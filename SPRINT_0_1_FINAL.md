# Sprint 0.1 Complete: Platform Kernel Bootstrap with Developer/Production Mode Separation

## ✅ Sprint 0.1 - DONE

The foundation of the AV Media Telangana Platform has been successfully implemented and polished according to the Sprint 0.1 specification, including the final developer/production mode separation in the overlay presentation layer.

### What was built:
- **Platform Kernel** (`platform/kernel/kernel.js`) - Manages lifecycle (BOOTING → READY → RUNNING → ERROR → STOPPED), service/runtime registration, and event emission.
- **Event Bus** (`platform/event-bus/eventBus.js`) - Publish/subscribe system with event envelope validation and ID generation (using `crypto.randomUUID()` or timestamp-counter fallback).
- **Render Runtime** (`platform/runtime/renderRuntime.js`) - Platform-agnostic runtime managing platform state, runtime state, and time updates (renamed from Overlay Runtime to avoid OBS-specific assumption).
- **Test Overlay** (`overlay/`) - Browser-based display with developer/production mode separation:
  - **Production mode** (`http://127.0.0.1:8085/overlay/`): Transparent canvas, no visible UI.
  - **Developer mode** (`http://127.0.0.1:8085/overlay/?dev=1` or `?debug=true`): Diagnostic panel showing:
    - Platform Running
    - Kernel State
    - Runtime State
    - Current Time
- **HTTP Server** (`server.js`) - Node.js built-in server serving static files and providing Server-Sent Events (SSE) endpoint at `/events` for real-time updates.
- **Platform Contracts** (`platform/contracts/`) - Interfaces defining EventEnvelope, KernelContract, RuntimeContract, ServiceContract.
- **Platform Constants** (`platform/constants/`) - Centralized event types and state strings to avoid magic strings.
- **Configuration** (`config/version.js`) - Central version definition injected into event envelopes.
- **Startup Script** (`start-server.bat`) - Double-clickable batch file to launch the server with proper environment checks.

### Validation:
- Server starts without errors and reports: "AV Media Telangana Platform v1.0.0"
- Overlay loads successfully in browser and as OBS Browser Source
- **Production mode**: Completely transparent background, no visible UI elements, platform continues to run internally (verified via SSE logs and console).
- **Developer mode**: Diagnostic panel visible with live kernel state, runtime state, and clock updates.
- Event bus properly validates envelopes and generates IDs
- No feature-specific code (Google Sheets, headlines, tickers, etc.) was included in Sprint 0.1 - pure platform foundation only
- All communication happens through the event bus with standardized envelopes

### Files Modified for Final Polish:
1. `overlay/main.js` - Added developer/production mode detection via URLSearchParams and conditional rendering/SSE setup.
2. `overlay/main.css` - Added CSS rules for `.production` class to hide the test box and set transparent background.

### Files NOT Modified (as required):
- `platform/` (kernel, event-bus, runtime, services, contracts, constants)
- `server.js`
- `config/`
- `shared/`
- `control-panel/`
- `docs/`
- `tests/`

### How to Run:
1. Double-click `start-server.bat` in the repository root, OR
2. Run `node server.js` from the command line
3. Open http://127.0.0.1:8085/overlay/ in a browser (should show nothing - transparent)
4. Open http://127.0.0.1:8085/overlay/?dev=1 in a browser (should show diagnostic panel)
5. In OBS Studio, add a Browser Source pointed at http://127.0.0.1:8085/overlay/ - you will see a fully transparent source ready for future graphics layers.

### Next Steps (Sprint 0.2):
Implement Google Sheet Service to fetch and publish real data, then connect overlay to display actual content (while preserving the developer/production mode switch in the presentation layer). Wait for architecture review before proceeding.

---
*Built with Node.js built-in modules only - zero external dependencies.*