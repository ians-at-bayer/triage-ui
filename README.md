# Support Triage Manager
Assessments Community at Bayer Innovation Day Project by Ian C. Smith

Simple web application for managing support triage rotations between team members.

## Build

### `npm run build`

Builds the app for production to the `build` folder.
Bundles React in production mode and optimizes the build for the best performance.

## Deploy

### `DOCKER_DEFAULT_PLATFORM=linux/amd64 fg-deploy -m fg-deploy-np.json`

Deploy contents of the `build` folder to ECS Fargate.

## Run

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000/support-triage-manager) to view it in the browser.