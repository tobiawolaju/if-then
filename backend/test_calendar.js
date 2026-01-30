require('dotenv').config();
const tools = require('./tools');

/**
 * TEST SCRIPT: Manual Google Calendar Verification
 * 
 * Usage:
 * node test_calendar.js <USER_ID> <GOOGLE_ACCESS_TOKEN>
 */

async function runTest() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: node test_calendar.js <USER_ID> <GOOGLE_ACCESS_TOKEN>");
        process.exit(1);
    }

    const userId = args[0];
    const accessToken = args[1];

    console.log("--- Starting Test ---");
    console.log("UserID:", userId);
    console.log("Token:", accessToken.substring(0, 10) + "...");

    const testActivity = {
        title: "Test Sync Event " + new Date().toLocaleTimeString(),
        startTime: "14:00",
        endTime: "15:00",
        description: "Created via manual test script to verify Calendar sync.",
        location: "Virtual",
        tags: ["test", "verification"]
    };

    const context = {
        uid: userId,
        accessToken: accessToken
    };

    try {
        console.log("\nAttempting to add activity...");
        const result = await tools.addActivity(testActivity, context);

        console.log("\n--- RESULT ---");
        console.log(JSON.stringify(result, null, 2));

        if (result.success) {
            console.log("\n✅ SUCCESS: Activity added to Firebase.");
            if (result.activity.googleEventId) {
                console.log("📅 CALENDAR SYNCED: Event ID " + result.activity.googleEventId);
                console.log("🔗 Web Link: " + result.activity.htmlLink);
            } else if (result.calendarError) {
                console.log("❌ CALENDAR FAILED: " + result.calendarError);
            } else {
                console.log("⚠️ CALENDAR SKIPPED: No googleEventId returned.");
            }
        } else {
            console.log("\n❌ FAILED: " + (result.error || result.message));
        }

    } catch (err) {
        console.error("\n💥 CRASHED:", err);
    }
}

runTest();
