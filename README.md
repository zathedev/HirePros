1. **Clone the repository:**
    ```bash
   git clone [https://github.com/your-username/HirePros.git](https://github.com/your-username/HirePros.git)
   cd HirePros
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Run the application:**
   ```bash
   # From root (concurrently or separate terminals)
   npm run dev
   ```

---

## 📸 Component Previews
- **Navbar:** Features a sticky search bar and Fiverr-style "Join" CTAs.
- **Home:** A high-impact hero section with localized stats for Pakistan.
- **Chat:** A split-pane messaging system with safety notifications.
- **Gig Cards:** Professional cards featuring provider levels, ratings, and budget labels.

---

## 🛡️ Safety & Security
HirePros encourages all users to keep communication and payments within the platform to ensure a secure transaction environment for both customers and providers.

---

## 📄 License
This project is licensed under the MIT License.