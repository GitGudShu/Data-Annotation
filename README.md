# Data-Annotation

This project aims to develop a state-of-the-art web platform for:
- Visualizing preloaded images from an existing dataset
- Analyzing segmented objects (pedestrians, vehicles, urban infrastructure)
- Assigning priority levels based on their importance in urban driving  
  (e.g., a crossing pedestrian is prioritized over a parked vehicle)

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

### 2. Environment Configuration

Create a `.env` file at the root of the `server` directory with the following content:

```
DB_NAME=annotation_appBDD
DB_USER='user_mysl'
DB_PASSWORD='mot_de_passe_mysql'
DB_HOST=localhost
JWT_SECRET=secretBilel
```

> ⚠️ Make sure to replace `'user_mysl'` and `'mot_de_passe_mysql'` with your actual MySQL credentials.

### 3. Database Initialization

Start MySQL from the `server/database` directory:

```bash
mysql -u root -p
```

Once connected, run:

```sql
SOURCE init.sql;
```

### 4. Run the Project

#### Client
```bash
ng serve
```

#### Server
```bash
npm run dev
```
