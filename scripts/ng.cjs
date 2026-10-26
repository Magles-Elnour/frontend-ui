const { release } = require('node:os');
const { spawnSync } = require('node:child_process');

// The native Sass runtime requires macOS 14 (Darwin 23) or newer.
// Angular also ships a JavaScript compiler that supports older Macs.
if (process.platform === 'darwin' && Number.parseInt(release(), 10) < 23) {
  process.env.NG_BUILD_SASS_EMBEDDED ??= 'false';
}

const result = spawnSync(
  process.execPath,
  [require.resolve('@angular/cli/bin/ng.js'), ...process.argv.slice(2)],
  { stdio: 'inherit', env: process.env },
);

if (result.error) {
  console.error(result.error.message);
}
process.exit(result.status ?? 1);
