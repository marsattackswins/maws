#!/usr/bin/env node

/**
 * Validates integration test setup and credentials.
 * Run: node scripts/check-integration-setup.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Checking MAWS integration test setup...\n");

let passed = 0;
let failed = 0;

function check(name, condition, details = "") {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
}

// Check .env.integration exists
const envPath = path.join(rootDir, ".env.integration");
const envExists = fs.existsSync(envPath);
check(
  ".env.integration file exists",
  envExists,
  "Run: cp .env.integration.example .env.integration"
);

// Load and check credentials
let apiKey = "";
let apiSecret = "";

if (envExists) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const keyMatch = envContent.match(/MAWS_BINANCE_API_KEY=(.+)/);
  const secretMatch = envContent.match(/MAWS_BINANCE_API_SECRET=(.+)/);

  apiKey = keyMatch?.[1]?.trim() || "";
  apiSecret = secretMatch?.[1]?.trim() || "";

  check(
    "MAWS_BINANCE_API_KEY is set",
    apiKey && apiKey !== "your-testnet-api-key-here",
    "Get testnet credentials from https://testnet.binancefuture.com"
  );

  check(
    "MAWS_BINANCE_API_SECRET is set",
    apiSecret && apiSecret !== "your-testnet-secret-here",
    "Get testnet credentials from https://testnet.binancefuture.com"
  );

  check(
    "API key format looks valid",
    apiKey.length > 20,
    `Current length: ${apiKey.length} (expected >20)`
  );

  check(
    "API secret format looks valid",
    apiSecret.length > 20,
    `Current length: ${apiSecret.length} (expected >20)`
  );
}

// Check test files exist
const integrationDir = path.join(rootDir, "tests", "integration");
check(
  "Integration test directory exists",
  fs.existsSync(integrationDir)
);

const testFiles = [
  "helpers.ts",
  "order-lifecycle.integration.test.ts",
  "position-sync.integration.test.ts",
  "stream-recovery.integration.test.ts",
];

for (const file of testFiles) {
  const filePath = path.join(integrationDir, file);
  check(
    `Test file exists: ${file}`,
    fs.existsSync(filePath)
  );
}

// Check package.json scripts
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

check(
  "test:integration script exists",
  !!packageJson.scripts["test:integration"]
);

check(
  "dotenv dependency installed",
  !!packageJson.dependencies?.dotenv || !!packageJson.devDependencies?.dotenv
);

// Test network connectivity (if credentials provided)
if (apiKey && apiKey !== "your-testnet-api-key-here") {
  console.log("\n🌐 Testing Binance testnet connectivity...");

  try {
    const testnetUrl = "https://testnet.binancefuture.com/fapi/v1/time";
    const response = await fetch(testnetUrl);
    
    if (response.ok) {
      console.log("✅ Testnet API is reachable");
      passed++;
    } else {
      console.log(`❌ Testnet returned ${response.status}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    failed++;
  }

  // Test API credentials
  console.log("\n🔑 Testing API credentials...");
  
  try {
    const timestamp = Date.now();
    const accountUrl = `https://testnet.binancefuture.com/fapi/v2/account?timestamp=${timestamp}`;
    
    const response = await fetch(accountUrl, {
      headers: {
        "X-MBX-APIKEY": apiKey,
      },
    });

    if (response.status === 401) {
      console.log("❌ API credentials are invalid");
      console.log("   Verify your API key and secret from testnet.binancefuture.com");
      failed++;
    } else if (response.status === 400) {
      // Expected without signature, but key is recognized
      console.log("✅ API key format accepted (signature validation expected)");
      passed++;
    } else if (response.ok) {
      console.log("✅ API credentials are valid");
      passed++;
    } else {
      console.log(`⚠️  Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Credential test failed: ${error.message}`);
    failed++;
  }
}

// Summary
console.log("\n" + "=".repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log("=".repeat(50) + "\n");

if (failed === 0) {
  console.log("🎉 All checks passed! You're ready to run integration tests:");
  console.log("   npm run test:integration\n");
  process.exit(0);
} else {
  console.log("❌ Some checks failed. Please fix the issues above.");
  console.log("📚 See tests/integration/SETUP.md for detailed setup instructions\n");
  process.exit(1);
}
