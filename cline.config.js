module.exports = {
  monorepo: true,
  rules: [
    '.cline/rules/style.ts',
    '.cline/rules/architecture.ts'
  ],
  workflows: {
    ci: ['lint', 'test', 'mod-analyze'],
    deploy: ['docker-build', 'deploy:staging']
  }
}
