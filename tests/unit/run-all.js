'use strict';
/**
 * Test runner — executes all unit test files and prints a summary.
 * Run with:  node tests/unit/run-all.js
 *          or npm test
 */

const files = [
  './eventBus.test.js',
  './kernel.test.js',
  './googleSheetService.test.js',
  '../../features/secondary-playlist/tests/consumer.test.js',
  '../../features/secondary-playlist/tests/domain.test.js',
];

async function main() {
  let totalPassed = 0;
  let totalFailed = 0;

  for (const file of files) {
    // Some test files return a plain object, others return a Promise
    const result = await Promise.resolve(require(file));
    totalPassed += result.passed || 0;
    totalFailed += result.failed || 0;
  }

  console.log('\n' + '─'.repeat(40));
  console.log(`  Total: ${totalPassed + totalFailed}  ✓ ${totalPassed}  ✗ ${totalFailed}`);
  console.log('─'.repeat(40) + '\n');

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
