import path from "path";
import dotenv from "dotenv";
import fs from "fs";

const envCandidates = [
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), ".env.local"),
  path.join(__dirname, "../../.env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export default {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret:process.env.JWT_ACCESS_SECRET,
};
