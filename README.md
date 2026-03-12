# BluClinic+ | Enterprise Healthcare Portal

**BluClinic+** is a robust, full-stack medical management system designed for high-availability deployment on Red Hat OpenShift. It streamlines the lifecycle of a medical consultation—from initial patient triage and registration to final diagnosis and professional report generation.

---

## 🏗 System Architecture

The application follows a modern 3-tier architecture, optimized for containerized orchestration and persistent data management within a DevOps ecosystem.

### 1. Frontend Layer (The Portal)
* **Framework:** React.js Single Page Application (SPA).
* **State Management:** Logic-driven UI using React Hooks (`useState`, `useEffect`).
* **Real-Time Sync:** Implements a **5-second polling mechanism** to ensure the Triage Dashboard and Patient Records are consistently updated with the backend state.
* **Styling:** Custom-themed CSS-in-JS focused on accessibility and medical professionalism.

### 2. Backend API Layer
* **Service:** Containerized RESTful API hosted on the OpenShift Container Platform (OCP).
* **Network Route:** `http://backend-url-blu-live-clinic.apps.lab.ocp.bludive/api`
* **Access Control:** Role-Based Access Control (RBAC) separating Admin, Doctor, and Patient permissions.

### 3. Infrastructure & Networking (OCP Lab)
* **Orchestration:** Managed via Red Hat OpenShift.
* **Networking:** Leverages **Multus CNI** for advanced pod networking and `network-metrics-daemon` for infrastructure observability.
* **Storage:** Persistent Volume Claims (PVCs) ensure medical records persist across pod lifecycles and node maintenance.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Virtual Triage** | Patients submit symptoms with age-group categorization (Infant to Senior) for intelligent sorting. |
| **Admin Dashboard** | Centralized control for assigning doctors to pending cases, resetting passwords, and deleting records. |
| **Doctor Portal** | Dedicated interface for active consultations, symptom review, and integrated diagnosis/prescription input. |
| **Professional Export** | Generate computer-signed Medical Reports (.txt) for patients and Clinic Activity logs (.csv) for admins. |
| **Automated Updates** | Real-time "Toast" notification system providing immediate feedback on system actions. |

---

## 📡 API Endpoints

| Method | Endpoint | Function |
| :--- | :--- | :--- |
| `GET` | `/api/patients` | Retrieve all active and historical records. |
| `POST` | `/api/register` | Create a new patient consultation request. |
| `PUT` | `/api/assign` | (Admin) Route a patient to a specific physician. |
| `PUT` | `/api/diagnose` | (Doctor) Finalize assessment and prescription. |
| `PUT` | `/api/patients/:id`| Administrative password reset. |
| `DELETE` | `/api/patients/:id`| Record removal (Admin only). |

---

## 🛠 Installation & Deployment

### Local Development
1. **Clone & Install:**
   ```bash
   git clone [https://github.com/your-repo/blu-clinic.git](https://github.com/your-repo/blu-clinic.git)
   cd blu-clinic
   npm install