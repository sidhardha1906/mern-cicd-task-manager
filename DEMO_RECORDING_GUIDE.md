# Demonstration Video Recording & Submission Guide

This guide provides a structured, professional 4–6 minute video presentation walkthrough for the **MERN CI/CD Task Manager** project. It is specifically tailored for final-year B.Tech CSE evaluations, technical interviews, and academic submissions.

---

## 1. 4–6 Minute Video Script & Timeline

| Timestamp | Phase | What to Show on Screen | Speaking Script / Talking Points |
|---|---|---|---|
| **0:00 – 0:30** | **Introduction & Objective** | Title slide or README.md in browser / IDE | "Hello, my name is Chandra Shekar. Today I am presenting my final-year full-stack project: the **MERN CI/CD Task Manager**. The primary objective of this project is to build an enterprise-grade web application using MongoDB, Express, React, and Node.js, backed by a fully automated CI/CD pipeline using GitHub Actions, containerized testing, and cloud hosting." |
| **0:30 – 1:30** | **Live Dashboard & UI** | Browser showing the running React application (`http://localhost:5173` or deployed Vercel URL) | "Here is the TaskFlow Pro dashboard. As you can see, we have a responsive dark-slate design system with glassmorphism accents. At the top, a live health monitor verifies connection with our backend REST API. The metrics section dynamically computes Total Tasks, Pending Tasks, Completed Tasks, and the Completion Rate percentage." |
| **1:30 – 2:30** | **Core CRUD Operations** | Live interaction on the dashboard | "Let's demonstrate full CRUD capability: <br>1. **Create**: Clicking 'New Task', I enter title 'Deploy to Production', set priority to 'High', and save. The task immediately appears via optimistic UI and persists to the database.<br>2. **Filter & Search**: Typing 'Deploy' filters the list instantly.<br>3. **Toggle Status**: Clicking the completion checkbox recalculates the completion rate from 0% to 100%.<br>4. **Update**: I open the edit modal, modify the description, and save.<br>5. **Delete**: I click delete, review the modal prompt, and confirm deletion." |
| **2:30 – 3:15** | **Architecture & Codebase** | VS Code / IDE showing folder structure | "Turning to the codebase architecture: The project is divided into modular client and server workspaces. The server uses an Express MVC pattern with Mongoose schemas, input validation middleware, and centralized error handling that prevents stack trace leaks. The client is a Vite-powered React single page application with reusable components and custom vanilla CSS." |
| **3:15 – 4:15** | **GitHub Actions CI/CD Pipeline** | GitHub repository -> 'Actions' tab | "A core highlight of this project is the automated CI/CD pipeline defined in `.github/workflows/ci-cd.yml`. On every push and pull request, GitHub Actions automatically executes: <br>- Parallel ESLint checks for both frontend and backend.<br>- 25 backend integration tests with Supertest and an isolated in-memory MongoDB server.<br>- 11 frontend component tests using Vitest and React Testing Library.<br>- Production bundling of the Vite client. <br>All checks must pass before any code can be merged or deployed." |
| **4:15 – 5:00** | **Cloud Deployment Strategy** | Vercel dashboard, Render dashboard, and live links | "For production hosting: The frontend Single Page Application is deployed to Vercel with automated Git integration and SPA route rewrites. The backend Express API runs on Render connected to a MongoDB Atlas cluster. When changes merge into `main`, the cloud providers trigger automatic builds with environment isolation." |
| **5:00 – 6:00** | **Technologies & Learning Outcomes** | Summary slide or conclusion | "In summary, this project demonstrates end-to-end full-stack engineering, test-driven reliability, automated DevOps workflows, secure environment management, and cloud deployment. Thank you for your time and evaluation." |

---

## 2. Windows Screen Recording Checklist

You can record your demonstration directly using free, built-in Windows tools or OBS Studio.

### Tool Options
1. **Windows Game Bar (Built-in)**:
   - Press <kbd>Windows</kbd> + <kbd>Alt</kbd> + <kbd>R</kbd> to start/stop recording.
   - Or press <kbd>Windows</kbd> + <kbd>G</kbd> to open the Game Bar overlay.
   - Recordings are saved to: `C:\Users\<Username>\Videos\Captures`.
2. **Microsoft Clipchamp (Built-in on Windows 11)**:
   - Search for **Clipchamp** in Windows Start menu.
   - Select **Record & create** -> **Screen and camera** (or Screen only).
3. **OBS Studio (Free & Open Source)**:
   - Available from [obsproject.com](https://obsproject.com/).
   - Add a **Display Capture** source and ensure your microphone is selected.

### Pre-Recording Checklist
- [ ] Ensure local servers are running (`npm run dev`) or deployed URLs are open.
- [ ] Open relevant browser tabs beforehand:
  - Tab 1: Live Application (`http://localhost:5173` or Vercel URL).
  - Tab 2: Backend Health API (`http://localhost:5000/api/health` or Render URL).
  - Tab 3: GitHub Repository -> **Actions** tab showing green CI check marks.
  - Tab 4: VS Code showing clean project tree and `.github/workflows/ci-cd.yml`.
- [ ] Test your microphone for clear audio without background noise.
- [ ] Set browser zoom to 100% or 110% for optimal readability.
- [ ] Close personal tabs, notifications, and messaging apps.

---

## 3. Google Drive Upload & Sharing Instructions

Follow these exact steps to ensure your evaluator can view the video without permission errors:

1. **Upload Video**:
   - Go to [drive.google.com](https://drive.google.com/).
   - Click **+ New** -> **File upload**.
   - Select your recorded `.mp4` or `.webm` file.
2. **Configure Sharing Permissions**:
   - Right-click the uploaded video file in Google Drive.
   - Click **Share** -> **Share**.
   - Under **General access**, change **Restricted** to **Anyone with the link**.
   - Ensure the permission role is set to **Viewer**.
   - Click **Copy link**, then click **Done**.
3. **Verify Link Access**:
   - Open a private/incognito browser window.
   - Paste the copied link to verify the video plays without requiring a login.

> [!IMPORTANT]
> Never submit a link set to "Restricted", as reviewers will be blocked from accessing your submission.

---

## 4. Final Submission Template

Fill out this template with your real URLs prior to academic or portfolio submission:

```text
================================================================================
FINAL-YEAR PROJECT SUBMISSION
================================================================================
Project Title:        MERN Stack CI/CD Task Management Application
Student Name:         Chandra Shekar
Branch / Semester:    B.Tech Computer Science and Engineering / Final Year

GitHub Repository:    https://github.com/sidhardha1906/mern-cicd-task-manager
Live Frontend URL:    https://<YOUR_PROJECT_NAME>.vercel.app
Backend Health URL:   https://<YOUR_API_NAME>.onrender.com/api/health
Demo Video (Drive):   https://drive.google.com/file/d/<YOUR_FILE_ID>/view?usp=sharing
================================================================================
```
