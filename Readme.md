# 🚀 Backend Development Notes

## Initial Setup

- `npm init`
- Create:
  - `.env`
  - `.gitignore`
  - `public/temp/.gitkeep`
- Enable ES Modules

```json
"type": "module"
```

- Install

```bash
npm i express mongoose dotenv
npm i -D nodemon
npm i prettier
```

- Update script

```json
"dev": "nodemon src/index.js"
```

- Create

```bash
mkdir controllers db middlewares models routes utils
```

- Create:
  - `.prettierrc`
  - `.prettierignore`

---

## MongoDB Connection

- Create Atlas Cluster.
- Configure **DB Access** & **Network Access**.
- Add URI to `.env`.

```env
MONGODB_URI=your_uri
```

- Create `db/index.js`.
- Export `connectDB()` and call it from `index.js`.

---

## 📝 Notes

- DB connection → `async/await` + `try-catch`.
- Never connect DB directly in one line.
- Import with extension.

```js
import connectDB from "./db/index.js";
```

- Log meaningful errors.

```js
console.log("MongoDB Connection Error:", error);
```

- Load `.env` before using `process.env`.
- Never commit `.env`.