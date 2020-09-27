module.exports = {
  apps : [{
    name: "muchadenga",
    script: ".dist/src/index.js",
    env: {
      NODE_ENV: "production",
      root: "",
      osui_connection_string: "postgresql://postgres:VL3UpDkRDdBQzmYdhH8d@phronesis.cmjvnktgyitg.us-east-2.rds.amazonaws.com",
    }
  }]
}