# Data-Annotation

This project aims to develop a state-of-the-art web platform for:  
- Visualizing preloaded images from an existing dataset  
- Analyzing segmented objects (pedestrians, vehicles, urban infrastructure)  
- Assigning priority levels based on their importance in urban driving  
  (e.g., a crossing pedestrian is prioritized over a parked vehicle)

---

## Demo

[![Watch the demo](https://img.youtube.com/vi/3RvI-yErNiI/hqdefault.jpg)](https://www.youtube.com/watch?v=3RvI-yErNiI)

> Click the image above to watch the video demo on YouTube.

---

## Installation Instructions

### 1. Install Dependencies

#### Client
```bash
cd client
npm install
```

#### Server
```bash
cd server
npm install
```

---

### 2. Required Dataset

In order for the project to function properly, you must download and set up the **Cityscapes dataset**, which contains the validation images and their corresponding polygon annotations.

1. Visit the official Cityscapes dataset page:  
   👉 [https://www.cityscapes-dataset.com/login/](https://www.cityscapes-dataset.com/login/)

2. **Create an account and log in**, then download the zip contains the images and the associated jsons.

3. Once downloaded, extract the contents and organize the folders as follows:

```
/server
 ├── /data
 │    ├── /val_images
 │    │    ├── /frankfurt
 │    │    ├── /lindau
 │    │    ├── /munster
 │    ├── /val_annotations
 │         ├── /frankfurt
 │         ├── /lindau
 │         ├── /munster
```

> ⚠️ The `/data` folder is `.gitignored` and **must be manually added** before running the application, just like the `.env` file.

---

### 3. Environment Configuration

Create a `.env` file at the root of the `server` directory with the following content:

```
DB_NAME=annotation_appBDD
DB_USER='user_mysl'
DB_PASSWORD='your_mysql_password'
DB_HOST=localhost
JWT_SECRET=secretBilel
```

> ⚠️ Make sure to replace `'user_mysl'` and `'your_mysql_password'` with your actual MySQL credentials.

---

### 4. Database Initialization

Start MySQL from the `server/database` directory:

```bash
mysql -u root -p
```

Once connected, run:

```sql
SOURCE init.sql;
```

---

### 5. Run the Project

#### Client
```bash
ng serve
```

#### Server
```bash
npm run dev
```
