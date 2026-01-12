# AutoSlot - Smart Parking Management System 🚗🛡️

AutoSlot is a comprehensive parking management solution designed to streamline vehicle tracking and enhance facility security through a centralized digital dashboard.

---

## 🚀 Key Functions

### 1. Vehicle Management & Live Scanning
The system provides a real-time overview of the parking environment, utilizing simulated AI scans to maintain high occupancy efficiency.
* **Live Area Scan:** Detects vehicles with high confidence (e.g., 90%+) and identifies vehicle types (Car, Van, Truck, Motorcycle).
* **Availability Tracking:** Instant visualization of available vs. occupied slots to prevent entry congestion.
* **Vehicle Distribution:** Dashboard analytics showing the breakdown of vehicle types currently on-site.

### 2. Security & Incident Management
A robust framework for maintaining safety and accountability within the parking premises.
* **Incident Reporting:** Security officers can log incidents such as "Unauthorized Entry," "Parking Violations," or "Suspicious Activity."
* **Severity & Status Tracking:** Categorize incidents by severity (Low, Medium, High) and track progress from "Open" to "Under Investigation."
* **Officer Assignment:** Capability to assign specific security personnel to open incidents for immediate action.

### 3. Employee & Shift Management
Managing the human element of security is integrated directly into the workflow.
* **Staff Directory:** Manage a complete list of employees with unique IDs (e.g., E10003) and assigned roles.
* **Dynamic Shift Scheduling:** Easily assign "Day," "Night," or "Half-Day" shifts to security staff to ensure 24/7 coverage.
* **Role-Based Profiles:** Individual profiles for Security, Managers, and Admins to control access levels.

### 4. System Reporting & Analytics
Generate data-driven insights for management review.
* **Vehicle Analysis:** Summarized detections over a custom date range.
* **Audit Trails:** Detailed incident reports including timestamps and assigned officers.
* **PDF Export:** One-click "Download as PDF" functionality for official record-keeping.

---

## 🛠️ Technical Overview

- **Frontend:** React.js with a dark-themed, high-contrast UI for security monitoring environments.
- **Backend:** Node.js / Express (Localhost:3000 environment).
- **Data Handling:** Real-time state management for incident updates and slot availability.
