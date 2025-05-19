🌑 Umbra

Umbra is a privacy-preserving geolocation proof system built on the Aleo platform. It allows users to prove that they are within a specific geographic zone—without ever revealing their exact location. Built using zero-knowledge proofs in Leo and a custom Go wrapper (GoLeo), Umbra enables verifiable location-based access, check-ins, and group presence, all while keeping sensitive coordinates completely private.
📸 Demo Video
https://youtube.com/shorts/s8p13pyEQiQ?feature=shared

✨ Features

    🔒 Zero-knowledge location proofs — verify location without revealing it

    🌐 Group-based geofences — define custom access zones for users

    ⚙️ Go-powered backend using GoLeo — a CLI wrapper for Aleo's leo tool

    📱 React Native frontend — mobile-first location input and proof UI

    🧮 Minimal, performant Leo circuit for proximity testing

💡 Inspiration

Location data is highly sensitive, yet most applications demand full access to it. I built Umbra to flip that narrative: apps shouldn’t need to know where you are — only whether you’re in the right place. Zero-knowledge proofs make that possible.
🚀 How It Works

    Create a group with a center point and radius — defining the “zone.”

    A user joins and provides their own location (privately).

    The backend runs a Leo circuit that checks whether the user is inside the zone, without revealing either set of coordinates.

    A ZK proof is generated and returned to the frontend — only the result (true/false) is revealed.

🛠 Tech Stack
Layer	Description
🔧 Leo	ZK circuit for Euclidean distance check
🧰 GoLeo	Custom Golang wrapper for the leo CLI
🖥️ Backend	Go HTTP server for proof orchestration
📱 Frontend	React Native mobile app for users/groups
🔒 Leo Circuit

transition main(
  lat1: i32, lon1: i32,
  lat2: i32, lon2: i32,
  radius_squared: i32
) -> bool {
  let dx = lon2 - lon1;
  let dy = lat2 - lat1;
  let dist_squared = dx * dx + dy * dy;
  return dist_squared <= radius_squared;
}

⚠️ Limitations

    The Aleo testnet was not functioning reliably at the time of submission (faucet + token issues).

    Proving and verification are executed locally (simulated chain logic).

    React Native does not currently support WebAssembly, so client-side proving was moved to the backend.

📦 Setup & Run
Requirements

    Leo installed and working

    Go 1.20+

    Mobile device/emulator to run the frontend

Clone the Repo

git clone https://github.com/your-username/umbra.git
cd umbra

Run Backend

cd backend
go run main.go

Run Frontend

cd frontend
npm install
npx expo start

🧠 What's Next

    ✅ On-chain deployment & verification (once mainnet/testnet stabilizes)

    📱 WASM proving in mobile via native modules or lightweight SDK

    🧾 Encrypted record management for proof privacy & persistence

    🌍 Umbra as a pluggable protocol for location-based access across dApps

🙏 Acknowledgments

    Aleo team & Leo language contributors

    The Aleo Hackathon for the challenge and motivation

    Everyone exploring real-world privacy applications in ZK
