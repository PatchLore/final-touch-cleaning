# 🏠 End-of-Tenancy Automation Platform
## Complete Setup Guide (Windows + WSL2)

---

## PART 1 — WSL2 Setup (15 mins, one time only)

### Step 1 — Enable WSL2 on Windows
Open **PowerShell as Administrator** and run:
```powershell
wsl --install
```
Restart your PC when prompted.

### Step 2 — Open WSL2 terminal
After restart, search "Ubuntu" in Start menu and open it.
Set a username and password when asked (remember these).

### Step 3 — Install Node.js 22 inside WSL2
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # should show v22.x.x
```

### Step 4 — Install Docker inside WSL2
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
docker --version  # should show Docker version
```

### Step 5 — Install OpenClaw
```bash
npm install -g openclaw
openclaw --version
```

### Step 6 — Install NemoClaw (one command!)
```bash
curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash
```
This installs OpenShell + NemoClaw + connects to NVIDIA cloud inference.
Takes 5-10 mins. When it finishes you'll see:
```
[INFO] === Installation complete ===
Run: nemoclaw my-assistant connect
```

### Step 7 — Connect to your sandbox
```bash
nemoclaw my-assistant connect
```
You're now inside the NemoClaw sandbox. Test it:
```bash
openclaw agent --agent main --local -m "hello" --session-id test
```
You should get a reply from Nemotron 3 Super via NVIDIA cloud. 🎉

### Step 8 — Get your NemoClaw API endpoint
Inside the sandbox, run:
```bash
nemoclaw my-assistant status
```
Note the local API port (usually http://localhost:3284) — you'll need this.

---

## PART 2 — App Setup (5 mins)

### Step 9 — Clone/open this project in Cursor
Open Cursor, then open the folder containing this project.

### Step 10 — Install dependencies
In Cursor's terminal (or WSL2 terminal):
```bash
npm install
```

### Step 11 — Create your .env.local file
Copy the example:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and fill in:
- `NEMOCLAW_API_URL` — from Step 8 above
- `STRIPE_SECRET_KEY` — from stripe.com (free test keys)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from stripe.com

### Step 12 — Run the app
```bash
npm run dev
```
Open http://localhost:3000 — your app is live! 🚀

---

## PART 3 — How the app works

```
Customer visits → Books a clean → AI generates quote →
Subcontractor assigned → Checklist sent → Updates automated
```

**Pages:**
- `/` — Landing page (customer facing)
- `/book` — Booking form
- `/dashboard` — Your admin dashboard
- `/leads` — Lead management

**AI Agent does:**
- Generates quotes based on property size/type
- Assigns best available subcontractor
- Sends confirmation emails + checklists
- Handles customer follow-up messages
- Flags issues that need your attention

---

## PART 4 — Deploying live (when ready)

```bash
# Push to GitHub, then deploy to Vercel (free):
npx vercel
```
Point your domain at Vercel. Done.

---

## Troubleshooting

**nemoclaw not found after install:**
```bash
source ~/.bashrc
```

**Docker permission denied:**
```bash
sudo usermod -aG docker $USER && newgrp docker
```

**Port already in use:**
```bash
npm run dev -- -p 3001
```
