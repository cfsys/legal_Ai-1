# Legal AI - Unified Fullstack Architecture 🏛️⚖️

Welcome to the unified **Legal AI Enterprise Fullstack** repository. This project consolidates both the **Admin Management Portal** and the **Customer / Lawyer AI Workspace** into an organized, maintainable structure.

---

## 📁 Directory Structure

```text
C:\Users\PRENEEL\Desktop\legal_fullstack\
├── frontend\
│   ├── admin\                   # Admin Management Web Console (React + Vite, Port 5174)
│   └── customer\                # Customer Legal AI Workspace (React + Vite, Port 5173)
│
├── backend\
│   ├── admin\                   # Admin Management API Server (Node.js/Express, Port 5001)
│   └── customer\                # Customer Legal AI API Server (Node.js/Express, Port 5000)
│
├── postman\
│   ├── Legal_AI_Fullstack_Master.postman_collection.json   # Unified collection with Admin + Customer APIs
│   ├── Legal_AI_Admin_APIs.postman_collection.json          # Standalone Admin Suite APIs (Port 5001)
│   ├── Legal_AI_Customer_APIs.postman_collection.json       # Standalone Customer Suite APIs (Port 5000)
│   └── Legal_AI_Environment.postman_environment.json        # Postman Environment Variables (Ports & Tokens)
│
├── start_admin.bat              # Quick Launcher for Admin Backend & Frontend
├── start_customer.bat           # Quick Launcher for Customer Backend & Frontend
├── package.json                 # Monorepo runner scripts
└── README.md                    # System architecture guide
```

---

## 🚀 Port & Service Mapping

| Service | Subdirectory | Port | Proxy Target / Base URL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Backend** | `backend/admin` | `5001` | `http://localhost:5001/api` | Admin auth, Master entities, Users, Firms, Security, Inquiries, Audit logs |
| **Admin Frontend** | `frontend/admin` | `5174` | `http://localhost:5174` | Enterprise Admin console dashboard |
| **Customer Backend** | `backend/customer` | `5000` | `http://localhost:5000/api` | Case research, Judgments, OCR Documents, Contracts, Matters, Calendar, Drafting |
| **Customer Frontend** | `frontend/customer` | `5173` | `http://localhost:5173` | Modern lawyer & client workspace |

---

## ⚡ How to Run

### Option 1: Quick Launchers (Double-Click)
- Double-click **`start_admin.bat`** to run Admin Backend (5001) and Admin Frontend (5174).
- Double-click **`start_customer.bat`** to run Customer Backend (5000) and Customer Frontend (5173).

### Option 2: Terminal Commands (From `legal_fullstack` root)

#### 1. Start Admin Suite:
```bash
# Terminal 1: Admin Backend
npm run start:backend:admin

# Terminal 2: Admin Frontend
npm run start:frontend:admin
```
Open Admin Portal: **`http://localhost:5174`**

#### 2. Start Customer Suite:
```bash
# Terminal 1: Customer Backend
npm run start:backend:customer

# Terminal 2: Customer Frontend
npm run start:frontend:customer
```
Open Customer Workspace: **`http://localhost:5173`**

---

## 📮 Postman API Collection Usage

Import the collections from the `postman/` directory directly into Postman:

1. **`Legal_AI_Fullstack_Master.postman_collection.json`** (Recommended):
   - Contains two organized folders:
     - 🛡️ **`[ADMIN APIS] Platform & Management (Port 5001)`**: All admin routes.
     - ⚖️ **`[CUSTOMER APIS] Legal AI Workspace (Port 5000)`**: All user/customer routes.
2. **`Legal_AI_Environment.postman_environment.json`**:
   - Imports preset variables:
     - `adminBaseUrl`: `http://localhost:5001/api`
     - `customerBaseUrl`: `http://localhost:5000/api`
     - `adminToken`: Auto-saved upon Admin login.
     - `customerToken`: Auto-saved upon Customer login.
