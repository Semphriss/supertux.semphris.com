// supertux.semphris.com - Dynamic website for SuperTux
// Copyright (C) 2021 A. Semphris <semphris@protonmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const config = require('./config.js');
global.config = config;

const fs = require("fs");
const express = require('express');
const cookie = require('cookie-parser');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
//app.use(helmet());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 500 * 1024 * 1024 },
  abortOnLimit: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Utilities provide useful global funcitons
fs.readdirSync('./src/utils').forEach(file => {
  if (file.endsWith(".js"))
    require('./src/utils/' + file);
});

// Divers enable server-wide features (authentication, logging, etc.) that must
// absolutely be executed before fetching the page the user requested
fs.readdirSync('./src/drivers').forEach(file => {
  if (file.endsWith(".js"))
    require('./src/drivers/' + file)(app);
});

// Site features are webpages and API features (they're in the same files)
fs.readdirSync('./src/sitefeats').forEach(file => {
  if (file.endsWith(".js"))
    require('./src/sitefeats/' + file).bind(app);
});

app.use(express.static('public'));

var server = app.listen(config.port, () => {
  console.log("Server running on port " + config.port);

  exec("zip -r " + __dirname + "/public/source.zip " + __dirname + "/* -x " + __dirname + "/public/source.zip -x " + __dirname + "/config_private.js -x " + __dirname + "/.git/", (err) => {
    if (!err)
      return;
    
    console.log("Could not create source archive - aborting");
    //server.close()
  })
});
