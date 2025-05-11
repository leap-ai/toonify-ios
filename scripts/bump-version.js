const fs = require('fs');
const path = require('path');
const semver = require('semver');

const appJsonPath = path.join(__dirname, '..', 'app.json'); // Assumes script is in frontend-mobile/scripts/

async function run() {
  try {
    const githubEventName = process.env.GITHUB_EVENT_NAME;
    const githubEventPath = process.env.GITHUB_EVENT_PATH;

    let incrementType = 'patch'; // Default increment type
    console.log('Env Vars', githubEventName, githubEventPath);
    if (githubEventName === 'push' && githubEventPath) {
      const eventData = JSON.parse(fs.readFileSync(githubEventPath, 'utf8'));
      console.log('Event Data', eventData);
      if (eventData.pull_request && eventData.pull_request.labels && eventData.pull_request.labels.length > 0) {
        const labels = eventData.pull_request.labels.map(label => label.name.toLowerCase());
        console.log('PR Labels:', labels);

        if (labels.includes('major')) {
          incrementType = 'major';
        } else if (labels.includes('minor')) {
          incrementType = 'minor';
        } else if (labels.includes('patch')) {
          incrementType = 'patch';
        }
        // If none of these specific labels are found, it defaults to 'patch' as initialized.
      } else {
        console.log('No labels found on PR, defaulting to patch increment.');
      }
    } else {
      console.log(`Unknown event type - ${githubEventName}, defaulting to patch increment.`);
    }

    console.log(`Determined increment type: ${incrementType}`);

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

    // Output for GitHub Actions
    console.log(`::set-output name=NEW_VERSION::${newVersion}`);

  } catch (error) {
    console.error('Error in version bumping script:', error);
    process.exit(1);
  }
}

run(); 