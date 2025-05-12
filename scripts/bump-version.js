const fs = require('fs');
const path = require('path');
const semver = require('semver');

const appJsonPath = path.join(__dirname, '..', 'app.json'); // Assumes script is in frontend-mobile/scripts/

async function run() {
  try {
    // Read increment type directly from an environment variable set by the workflow
    let incrementType = process.env.INCREMENT_TYPE ? process.env.INCREMENT_TYPE.toLowerCase() : 'patch';

    // Validate incrementType to be one of the allowed values
    const validIncrementTypes = ['major', 'minor', 'patch'];
    if (!validIncrementTypes.includes(incrementType)) {
      console.warn(`Invalid INCREMENT_TYPE: "${process.env.INCREMENT_TYPE}". Defaulting to 'patch'.`);
      incrementType = 'patch';
    }

    console.log(`Using increment type: ${incrementType}`);

    const appConfigStr = fs.readFileSync(appJsonPath, 'utf8');
    const appConfig = JSON.parse(appConfigStr);
    const currentVersion = appConfig.expo.version;

    if (!semver.valid(currentVersion)) {
      console.error(`Invalid current version in app.json: ${currentVersion}`);
      process.exit(1);
    }

    const newVersion = semver.inc(currentVersion, incrementType);
    if (!newVersion) {
      console.error(`Could not increment version ${currentVersion} with type ${incrementType}`);
      process.exit(1);
    }
    console.log(`Current version: ${currentVersion}, New version: ${newVersion}`);

    appConfig.expo.version = newVersion;
    fs.writeFileSync(appJsonPath, JSON.stringify(appConfig, null, 2) + '\n');
    console.log(`Successfully bumped version in ${appJsonPath} to ${newVersion}`);

    // Output for GitHub Actions (if needed by subsequent steps in the same job)
    console.log(`::set-output name=NEW_VERSION::${newVersion}`);

  } catch (error) {
    console.error('Error in version bumping script:', error);
    process.exit(1);
  }
}

run(); 