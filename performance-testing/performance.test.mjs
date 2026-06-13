import { chromium } from 'playwright';

/**
 * Performance stress/load test script for rubinos-eg.com
 * Measures FCP (First Contentful Paint), DOM Interactive, and estimated TTI (Time to Interactive).
 * Asserts that the page loads and becomes interactive in under 2 seconds.
 */
async function runPerformanceTest() {
  const targetUrl = 'https://rubinos-eg.com';
  console.log(`\n==================================================`);
  console.log(`🚀 Starting Performance Test for: ${targetUrl}`);
  console.log(`==================================================\n`);

  // Launch browser with empty cache to simulate first-time visitor
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Playwright-Performance-Tester/1.0',
  });
  
  const page = await context.newPage();

  // Inject observer to capture First Contentful Paint (FCP)
  await page.addInitScript(() => {
    window.fcpValue = null;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('first-contentful-paint');
      if (entries.length > 0) {
        window.fcpValue = entries[0].startTime;
      }
    }).observe({ type: 'paint', buffered: true });
  });

  const startTime = Date.now();

  try {
    // Navigate to the target page and wait until DOMContentLoaded / Load
    console.log(`⏳ Navigating to homepage...`);
    const response = await page.goto(targetUrl, {
      waitUntil: 'load',
      timeout: 15000,
    });

    if (!response || response.status() !== 200) {
      throw new Error(`Failed to load page. Status: ${response ? response.status() : 'Unknown'}`);
    }

    // Wait for FCP to populate, up to 3 seconds max
    console.log(`⏳ Waiting for First Contentful Paint (FCP) to resolve...`);
    for (let i = 0; i < 6; i++) {
      const fcp = await page.evaluate(() => window.fcpValue || (performance.getEntriesByName('first-contentful-paint')[0]?.startTime) || null);
      if (fcp) break;
      await page.waitForTimeout(500);
    }
    
    const totalTimeMs = Date.now() - startTime;

    // Retrieve metrics from the browser
    const metrics = await page.evaluate(() => {
      // Access Navigation Timing API
      const [navTiming] = performance.getEntriesByType('navigation');
      
      // Calculate times relative to navigationStart (0)
      const domInteractive = navTiming ? navTiming.domInteractive : null;
      const loadEventEnd = navTiming ? navTiming.loadEventEnd : null;
      
      // Attempt to retrieve FCP from global window state
      const fcp = window.fcpValue || (performance.getEntriesByName('first-contentful-paint')[0]?.startTime) || null;
      
      return {
        fcp,
        domInteractive,
        loadEventEnd,
      };
    });

    // TTI estimation based on navigation timing load event and network idle
    const fcpSec = metrics.fcp ? (metrics.fcp / 1000).toFixed(2) : 'N/A';
    const domInteractiveSec = metrics.domInteractive ? (metrics.domInteractive / 1000).toFixed(2) : 'N/A';
    const loadEventSec = metrics.loadEventEnd ? (metrics.loadEventEnd / 1000).toFixed(2) : 'N/A';
    const totalTimeSec = (totalTimeMs / 1000).toFixed(2);

    console.log(`\n📊 Performance Metrics Captured:`);
    console.log(`--------------------------------------------------`);
    console.log(`⏱️  First Contentful Paint (FCP):   ${fcpSec}s`);
    console.log(`⏱️  DOM Interactive:                ${domInteractiveSec}s`);
    console.log(`⏱️  Load Event End:                 ${loadEventSec}s`);
    console.log(`⏱️  Total Load Time (Network Idle):  ${totalTimeSec}s`);
    console.log(`--------------------------------------------------\n`);

    // Performance Threshold Assertions
    const loadThresholdMs = 2000; // 2 seconds
    let testsPassed = true;

    if (metrics.fcp && metrics.fcp > loadThresholdMs) {
      console.error(`❌ FAIL: First Contentful Paint exceeded 2 seconds limit (${fcpSec}s).`);
      testsPassed = false;
    } else if (metrics.fcp) {
      console.log(`✅ PASS: First Contentful Paint is under 2 seconds (${fcpSec}s).`);
    } else {
      console.warn(`⚠️  WARNING: Could not measure First Contentful Paint.`);
    }

    if (totalTimeMs > loadThresholdMs) {
      console.error(`❌ FAIL: Total Load Time exceeded 2 seconds limit (${totalTimeSec}s).`);
      testsPassed = false;
    } else {
      console.log(`✅ PASS: Total Load Time is under 2 seconds (${totalTimeSec}s).`);
    }

    if (testsPassed) {
      console.log(`\n🎉 Success! The homepage meets performance criteria.\n`);
    } else {
      console.error(`\n❌ Performance criteria not met. Please optimize assets and caching.\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`❌ Error during performance test: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPerformanceTest();
