// cli.js
import { generateResource } from './cli-utils.js';

const args = process.argv.slice(2);

if (args[0] === 'make:resource' && args[1]) {
  const name = args[1];
  const adapterIndex = args.indexOf('-a');
  const adapter = adapterIndex !== -1 ? args[adapterIndex + 1] : 'mongo';

  generateResource(name, adapter);
} else {
  console.log('Usage: node cli.js make:resource <ResourceName> -a <database (mongo|supabase)>');
}
