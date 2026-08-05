# 🚀 Backend Development Notes (Node.js + Express)

## Initial Project Setup

* Initialize the project

  ```bash
  npm init
  ```

* Create:

  * `public/temp/.gitkeep`
  * `.env`
  * `.gitignore` (use Git Ignore Generator)

* Enable ES Modules

  ```json
  "type": "module"
  ```

* Install **Nodemon** (Development only)

  ```bash
  npm i -D nodemon
  ```

* Update `package.json`

  ```json
  "scripts": {
    "dev": "nodemon src/index.js"
  }
  ```

* Create `src/index.js`

* Create core folders

  ```bash
  mkdir controllers db middlewares models routes utils
  ```

* Install **Prettier**

  ```bash
  npm i prettier
  ```

* Create:

  * `.prettierrc`
  * `.prettierignore`

---

## 📝 Quick Notes

* Use ES Modules (`type: module`).
* Keep secrets inside `.env`.
* Never commit `.env`.
* Nodemon is for development only.
* Use `.gitkeep` to track empty folders.
* Configure Prettier before writing code.
