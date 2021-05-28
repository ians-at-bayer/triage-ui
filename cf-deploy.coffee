module.exports = (cfDeploy) ->
  endpoint: "api.mcf-np.threega.com"
  deployable: './build'
  deployer: cfDeploy.deployers.awsDeployment
  diskLimit: "512M"
  instances: "1"
  memoryLimit: "256M"
  org: "field"
  space: "triton"
  route: "support-triage-manager-ui"
  domain: "mcf-np.local"
  services: []
  startupCommand: 'serve -l 8080'